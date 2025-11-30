// ai/src/chat/handler.js
import { retrieveTopK } from '../rag/retriever.js';
import { env } from '../config/env.js';
import { searchRoomsAPI, getRoomInfoByNumber } from './bookingApi.js';
import { SYSTEM_PROMPT } from '../../knowledge/promt_sys.js';

// =============== BẢO MẬT + LỌC OUTPUT ===============
function sanitizeAnswer(text) {
  if (!text) return text;

  let sanitized = text;

  const forbiddenPatterns = [
    /DATABASE_URL/gi,
    /SUPABASE_[A-Z0-9_]+/gi,
    /JWT_SECRET/gi,
    /API_KEY/gi,
    /ACCESS_TOKEN/gi,
    /SECRET_KEY/gi,
    /sk-[a-z0-9]{20,}/gi,
    /Bearer\s+[a-z0-9\-_.]{10,}/gi
  ];

  for (const pattern of forbiddenPatterns) {
    sanitized = sanitized.replace(pattern, '[thông tin bảo mật]');
  }

  // Nếu lỡ sinh ra tiếng Trung (CJK) thì thay bằng câu xin lỗi tiếng Việt
  if (/[\u4e00-\u9fff]/.test(sanitized)) {
    sanitized =
      'Xin lỗi, đã xảy ra lỗi khi tạo câu trả lời. Bạn có thể hỏi lại, mình sẽ hỗ trợ bằng tiếng Việt nhé.';
  }

  return sanitized;
}

// =============== UTIL: TRÍCH SỐ PHÒNG ===============
function extractRoomNumberFromText(text) {
  // Regex: tìm "phòng X" nhưng X KHÔNG được theo sau bởi "người" hoặc "khách"
  // (?!\s*(người|khách)) là negative lookahead
  const m = text.match(/phòng\s*(\d{1,4})(?!\s*(người|khách))/i);
  if (!m) return null;
  return m[1]; // string
}


async function handleBookingConfirm({ userKey, query, passages }) {
  const lower = (query || '').toLowerCase();
  const roomNumber = extractRoomNumberFromText(lower);

  // không có số phòng → yêu cầu user nói rõ
  // không có số phòng → THAY VÌ ĐÒI SỐ PHÒNG, HÃY TÌM PHÒNG THEO NHU CẦU
  if (!roomNumber) {
     // Trích xuất filter từ query
     const filters = await extractRoomFiltersFromQuery(query);

     // Nếu có thông tin tìm kiếm (số người, ngày...)
     if (filters.capacity || (filters.checkIn && filters.checkOut) || filters.type || filters.maxPrice) {
        // Gọi searchRoomsAPI để tìm phòng phù hợp
        try {
          const rooms = await searchRoomsAPI(filters);
          if (rooms && rooms.length > 0) {
              const context = buildRoomsApiContext(rooms, filters);
              return {
                  answer: `Bạn chưa chọn số phòng cụ thể. Dựa trên yêu cầu của bạn, mình tìm thấy các phòng sau:\n${context}\n\nBạn muốn chốt phòng nào? Hãy nhắn "Đặt phòng số..." nhé.`,
                  passages
              };
          }
        } catch (err) {
          console.error('Error searching rooms in fallback:', err);
        }
     }

    return {
      answer:
        'Bạn muốn đặt phòng nào? Hãy nói rõ số phòng (ví dụ "đặt phòng 202") hoặc cho mình biết nhu cầu (số người, ngày đi) để mình tìm giúp nhé.',
      passages
    };
  }

  //  trích filter (ngày, số khách, loại phòng...) từ câu hỏi
  const filters = await extractRoomFiltersFromQuery(query);

  if (!filters.checkIn || !filters.checkOut) {
    return {
      answer:
        'Để mình kiểm tra chính xác phòng còn trống, bạn cho mình biết thêm **ngày nhận phòng** và **ngày trả phòng** nhé (ví dụ 2025-12-01 đến 2025-12-05).',
      passages
    };
  }

  //  kiểm tra phòng có tồn tại không
  let roomInfo;
  try {
    roomInfo = await getRoomInfoByNumber(roomNumber);
  } catch (err) {
    console.error('getRoomInfoByNumber error:', err);
    return {
      answer:
        'Hệ thống đang gặp lỗi khi kiểm tra số phòng. Bạn thử lại sau hoặc vào trang Đặt phòng giúp mình nhé.',
      passages
    };
  }

  if (!roomInfo || roomInfo.exists === false) {
    return {
      answer:
        `Khách sạn hiện **không có phòng số ${roomNumber}** hoặc phòng này không còn được sử dụng.\n` +
        `Bạn có thể kiểm tra lại số phòng hoặc để mình gợi ý một số phòng khác phù hợp với nhu cầu của bạn.`,
      passages
    };
  }

  //  phòng có tồn tại → kiểm tra trống hay không bằng ROOMS_API
  let rooms = [];
  try {
    rooms = await searchRoomsAPI(filters);
  } catch (err) {
    console.error('searchRoomsAPI error:', err);
    return {
      answer:
        'Hệ thống đang gặp lỗi khi kiểm tra phòng trống. Bạn có thể thử lại sau hoặc vào trang Đặt phòng để xem danh sách phòng nhé.',
      passages
    };
  }

  const selected = rooms.find(
    (r) => String(r.room_id) === String(roomInfo.room_id)
  );

  //  không thấy trong ROOMS_API → không còn trống
  if (!selected) {
    return {
      answer:
        `Rất tiếc, phòng **${roomNumber}** hiện **không còn trống** trong khoảng ${filters.checkIn} – ${filters.checkOut}.\n\n` +
        `Mình có thể gợi ý cho bạn một số phòng khác phù hợp (cùng số khách / khoảng ngày) không?`,
      passages
    };
  }

  //  phòng còn trống → tạo link đặt phòng
  const params = new URLSearchParams();
  params.set('room', selected.room_id); // dùng room_id thật trong DB
  params.set('checkIn', filters.checkIn);
  params.set('checkOut', filters.checkOut);
  if (filters.capacity) params.set('capacity', filters.capacity);

  const bookingPath = `/booking?${params.toString()}`;

  return {
    answer:
      `Phòng **${roomNumber}** hiện vẫn **còn trống** từ ${filters.checkIn} đến ${filters.checkOut} cho ${
        filters.capacity || 'số'
      } khách.\n\n` +
      `👉 [Đặt phòng ngay](${bookingPath})\n\n` +
      `Bạn bấm vào link trên để chuyển sang trang xác nhận và thanh toán nhé.`,
    passages
  };
}

// =============== RAG: BUILD CONTEXT ===============
function buildContextText(passages) {
  if (!passages?.length) {
    return 'Không có dữ liệu nào được tìm thấy trong knowledge base cho câu hỏi này.';
  }

  return passages
    .map(
      (p, idx) =>
        `# Đoạn ${idx + 1} (score=${
          p.score?.toFixed ? p.score.toFixed(3) : p.score
        } | source=${p.source || 'unknown'})\n${p.text}`
    )
    .join('\n\n');
}

// =============== INTENT DETECTION ===============
async function detectIntent(query) {
  try {
    const res = await fetch(env.chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.chatModel,
        messages: [
          {
            role: 'system',
            content: `
Bạn là module phân loại câu hỏi. Chỉ trả lời bằng JSON.

CẤU TRÚC JSON:
{
  "intent": "room_suggestion" | "room_info" | "amenity" | "booking" | "booking_confirm" | "other"
}

Quy tắc:
- "room_suggestion": tìm phòng theo nhu cầu (“phòng cho 3 người…”, “phòng rẻ nhất”, “phòng view đẹp…”)
- "room_info": hỏi chi tiết 1 phòng (“phòng 202 giá bao nhiêu”, “phòng Deluxe có gì”)
- "amenity": tiện ích khách sạn (“có hồ bơi không”, “ăn sáng mấy giờ”)
- "booking": hỏi quy trình đặt phòng (“đặt phòng như nào”, “có cần cọc không”)
- "booking_confirm": user muốn *chốt đặt phòng*:
   - “đặt phòng 202”
   - “cho tôi đặt phòng 202”
   - “phòng đó ok, đặt luôn”
   - “tôi lấy phòng 201”
   - “book phòng 202 giúp tôi”
- "other": nằm ngoài khách sạn
          `
          },
          { role: 'user', content: query }
        ],
        temperature: 0
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[ai] detectIntent error res:', res.status, text);
      return { intent: 'other' };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    try {
      const parsed = JSON.parse(content);
      if (typeof parsed.intent === 'string') {
        return { intent: parsed.intent };
      }
    } catch (e) {
      console.error('[ai] detectIntent JSON parse error:', e, 'content=', content);
    }

    return { intent: 'other' };
  } catch (err) {
    console.error('[ai] detectIntent fatal error:', err);
    return { intent: 'other' };
  }
}

function normalizeDateToFuture(raw) {
  if (!raw) return null;
  const str = String(raw).trim();

  const now = new Date();
  const currentYear = now.getFullYear();
  const todayMid = new Date(currentYear, now.getMonth(), now.getDate()).getTime();

  let day = null;
  let month = null;
  let year = null;

  let m;

  // Case 1: YYYY-MM-DD
  m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    year = Number(m[1]);
    month = Number(m[2]);
    day = Number(m[3]);
  }

  // Case 2: DD/MM or DD-MM or DD/MM/YYYY
  if (!m) {
    m = str.match(/^(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?$/);
    if (m) {
      day = Number(m[1]);
      month = Number(m[2]);
      if (m[3]) year = Number(m[3]);
    }
  }

  if (!day || !month) {
    // không parse được → bỏ
    return null;
  }

  // Nếu thiếu năm → lấy năm hiện tại
  if (!year) {
    year = currentYear;
  }

  // Nếu năm < hiện tại → bỏ luôn, dùng năm hiện tại để tính
  if (year < currentYear) {
    year = currentYear;
  }

  let d = new Date(year, month - 1, day);

  // Nếu vẫn là quá khứ so với hôm nay → coi như năm sau
  if (d.getTime() < todayMid) {
    d = new Date(currentYear + 1, month - 1, day);
  }

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}





// =============== TRÍCH FILTER TÌM PHÒNG ===============
async function extractRoomFiltersFromQuery(query) {
  try {
    const res = await fetch(env.chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.chatModel,
        messages: [
          {
            role: 'system',
            content: `
Bạn là module phân tích yêu cầu đặt phòng.
Nhiệm vụ: đọc câu hỏi của user và trích ra filter tìm phòng.

CHỈ TRẢ LỜI BẰNG MỘT OBJECT JSON, VÍ DỤ:
{
  "capacity": 2,
  "minPrice": 800000,
  "maxPrice": 1500000,
  "type": "deluxe",
  "checkIn": "2025-11-27",
  "checkOut": "2025-11-29"
}

Quy ước:
- "capacity": số lượng khách (int hoặc null).
- "minPrice", "maxPrice": VND/đêm (int hoặc null).
- "type": "deluxe" | "suite" | "standard" | "vip" | null.
- "checkIn", "checkOut": chuỗi ngày.

Nếu user không nói rõ một field -> để null.
KHÔNG thêm giải thích, KHÔNG bọc trong \`\`\`, chỉ trả JSON thuần.
Hôm nay là ${new Date().toISOString().slice(0,10)}.
          `
          },
          { role: 'user', content: query }
        ],
        temperature: 0
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[ai] extractRoomFiltersFromQuery error res:', res.status, text);
      return {};
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error(
        '[ai] extractRoomFiltersFromQuery JSON parse error:',
        e,
        'content=',
        content
      );
      return {};
    }

    const filters = {
      capacity: parsed.capacity || null,
      minPrice: parsed.minPrice || null,
      maxPrice: parsed.maxPrice || null,
      type: parsed.type || null,
      checkIn: normalizeDateToFuture(parsed.checkIn),
      checkOut: normalizeDateToFuture(parsed.checkOut),
    };

    console.log('[AI] Filters sau normalize =', filters);
    return filters;
  } catch (err) {
    console.error('[ai] extractRoomFiltersFromQuery fatal error:', err);
    return {};
  }
}



// =============== BUILD CONTEXT TỪ API PHÒNG ===============
function buildRoomsApiContext(rooms, filters = {}) {
  if (!rooms || rooms.length === 0) {
    return 'Không tìm thấy phòng phù hợp từ API (theo điều kiện bạn cung cấp).';
  }

  const top = rooms.slice(0, 3);

  const lines = top.map((room, idx) => {
    const price = room.price;
    const capacity = room.capacity;

    const roomNumber =
      room.room_number ??
      room.number ??
      room.roomNo ??
      room.roomno ??
      room.roomId ??
      room.id ??
      room.room_id ??
      'không rõ số phòng';

    // ID dùng cho BookingPage (room_id trong DB)
    const roomId = room.room_id ?? room.id;

    const baseLines = [
      `### Phòng #${idx + 1}: Loại **${room.type || 'không rõ loại'}**`,
      `- **Số phòng:** ${roomNumber}`,
      price ? `- **Giá mỗi đêm:** ${price.toLocaleString('vi-VN')} VND` : null,
      capacity ? `- **Số khách phù hợp:** ${capacity} người` : null
    ].filter(Boolean);

    // Nếu không có roomId thì không tạo link booking
    if (!roomId) {
      return baseLines.join('\n');
    }

    const params = new URLSearchParams({
      room: String(roomId),
      checkIn: filters.checkIn || '',
      checkOut: filters.checkOut || '',
      capacity: String(filters.capacity || '')
    });

    const bookingPath = `/booking?${params.toString()}`;

    return (
      baseLines.join('\n') +
      `\n- 👉 [Đặt phòng ngay](${bookingPath})`
    );
  });

  return (
    '## Thông tin về các phòng gợi ý\n\n' +
    lines.join('\n\n') +
    '\n\nBạn có thể bấm vào **"Đặt phòng ngay"** để chuyển tới trang đặt phòng được điền sẵn thông tin.'
  );
}

// =============== CONVERSATION MEMORY (BACKEND) ===============
const MAX_HISTORY_MESSAGES = 10;
const conversationStore = new Map();   // userKey -> [{role, content}]
const filterStore = new Map();         // userKey -> last filters
const roomStore = new Map();           // userKey -> last rooms

function getUserKey(userId, sessionId) {
  if (userId) return `user_${userId}`;
  return `anon_${sessionId}`;
}

function getUserHistory(userKey) {
  return conversationStore.get(userKey) || [];
}

function appendToHistory(userKey, role, content) {
  if (!content) return;
  const prev = conversationStore.get(userKey) || [];
  const next = [...prev, { role, content }];
  const trimmed = next.slice(-MAX_HISTORY_MESSAGES);
  conversationStore.set(userKey, trimmed);
}

// =============== HÀM CHÍNH ===============
export async function chatWithRag({ query, userId, accessToken }) {
  const lower = (query || '').toLowerCase();
  const sessionId = accessToken?.sessionId || env.sessionIdFallback || 'default';
  const userKey = getUserKey(userId, sessionId);

  // 1. CHẶN HỦY PHÒNG (nhưng tránh bắt nhầm "đặt phòng")
  const cancelPatterns = [
    /\bhủy\b/g,
    /\bhuỷ\b/g,
    /\bhũy\b/g,
    /\bcancel\b/g,
    /\bhủy phòng\b/g,
    /\bhuỷ phòng\b/g,
    /\bhủy đặt\b/g,
    /\bhuỷ đặt\b/g
  ];

  if (cancelPatterns.some((p) => p.test(lower)) && !/\bđặt\b/.test(lower)) {
    return {
      answer:
        'Vì lý do bảo mật, mình không thể hỗ trợ hủy phòng trực tiếp qua chat. ' +
        'Bạn vui lòng vào trang **"Lịch sử đặt phòng"** trong tài khoản hoặc liên hệ trực tiếp lễ tân để được hỗ trợ nhanh nhất nhé.',
      passages: []
    };
  }

  // 2. LẤY RAG CONTEXT
  const passages = await retrieveTopK(query, 5);
  const contextText = buildContextText(passages);

  // 3. PHÂN LOẠI INTENT
  const { intent } = await detectIntent(query);
  const isRoomSuggestion = intent === 'room_suggestion';
  const isBookingConfirm = intent === 'booking_confirm';
  const isBookingRequest = intent === 'booking';

  // 4. BOOKING_CONFIRM → DÙNG HANDLER RIÊNG
  if (isBookingConfirm) {
    return await handleBookingConfirm({ userKey, query, passages });
  }

  // 5. NẾU LÀ GỢI Ý PHÒNG → GỌI API PHÒNG
  let roomsApiContext = '';
  let filters = {};

  if (isRoomSuggestion || isBookingRequest) {
    try {
      filters = await extractRoomFiltersFromQuery(query);
      filterStore.set(userKey, filters);

      const rooms = await searchRoomsAPI(filters);
      roomStore.set(userKey, rooms);

      if (!rooms || rooms.length === 0) {
        return {
          answer:
            'Hiện tại hệ thống không tìm được phòng phù hợp với điều kiện bạn đưa ra. ' +
            'Bạn có thể thử thay đổi ngày nhận/trả phòng, số lượng khách hoặc vào trang Đặt phòng để xem đầy đủ danh sách phòng.',
          passages,
        };
      }

      roomsApiContext = '\n\n---\n' + buildRoomsApiContext(rooms, filters);
    } catch (err) {
      console.error('[ai] Lỗi khi gọi API phòng cho intent room_suggestion/booking:', err);
      roomsApiContext =
        '\n\n---\n(Lưu ý: Có lỗi khi lấy danh sách phòng từ hệ thống đặt phòng, bạn có thể vào trang Đặt phòng để xem chi tiết hơn.)';
    }
  }

  // 6. LẤY HISTORY CỦA USER
  const history = getUserHistory(userKey);

  // 7. GỌI MODEL CHÍNH VỚI CONTEXT + HISTORY
  const res = await fetch(env.chatUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.chatModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'system',
          content:
            'CONTEXT dưới đây là kiến thức nội bộ về khách sạn và (nếu có) danh sách phòng từ API backend. ' +
            'Hãy ưu tiên sử dụng thông tin này để trả lời cho người dùng:\n\n' +
            contextText +
            roomsApiContext
        },
        ...history,
        { role: 'user', content: query }
      ],
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[ai] chatWithRag error response:', errText);
    throw new Error('Chat service (AI) lỗi');
  }

  const data = await res.json();
  const rawAnswer =
    data.choices?.[0]?.message?.content || 'Xin lỗi, hiện tại tôi không trả lời được.';

  let answer = sanitizeAnswer(rawAnswer);

  // Chuẩn hóa format cho UI: không để quá nhiều dòng trống
  answer = answer.trim().replace(/\n{3,}/g, '\n\n');

  // 8. CẬP NHẬT HISTORY (sau khi đã gọi AI thành công)
  appendToHistory(userKey, 'user', query);
  appendToHistory(userKey, 'assistant', answer);

  return {
    answer,
    passages
  };
}
export function resetConversation(userId, sessionId) {
  const userKey = userId
    ? `user_${userId}`
    : `anon_${sessionId}`;

  conversationStore.delete(userKey);
  filterStore.delete(userKey);
  roomStore.delete(userKey);

  console.log('[AI] Reset hội thoại cho:', userKey);
}
