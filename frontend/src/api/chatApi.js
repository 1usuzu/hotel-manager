// src/api/chatApi.js
export async function sendChatMessage({ message, userId, accessToken }) {
  const res = await fetch('http://localhost:4100/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // sau này có auth thì gắn thêm Authorization ở đây nếu cần
    },
    body: JSON.stringify({
      message,      // 👈 tên field chuẩn backend đọc
      userId,
      accessToken,  // nếu backend dùng, giữ lại, không thì có thể bỏ
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Chat API error:', text)
    throw new Error('Chat API error')
  }

  return res.json() // { answer, passages, ... }
}
