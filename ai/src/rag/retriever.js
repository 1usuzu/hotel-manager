// ai/src/rag/retriever.js
import { query } from './db.js';
import { embedText } from './embedder.js';

// Lấy top-k đoạn tri thức từ bảng knowledge_chunks bằng pgvector
export async function retrieveTopK(userQuery, k = 5) {
  if (!userQuery || !userQuery.trim()) return [];

  // 1. Embed câu hỏi
  const embedding = await embedText(userQuery);
  if (!embedding?.length) return [];

  // 2. Convert sang literal cho cột vector
  // Supabase pgvector nhận dạng dạng '[0.1,0.2,...]'
  const embeddingLiteral = '[' + embedding.join(',') + ']';

  // 3. Query top-k theo cosine distance
  // embedding <-> $1::vector = khoảng cách cosine (do đã normalize)
  const sql = `
    SELECT
      id,
      title,
      source,
      chunk_index,
      content,
      1 - (embedding <=> $1::vector) AS score
    FROM knowledge_chunks
    ORDER BY embedding <-> $1::vector
    LIMIT $2;
  `;

  const res = await query(sql, [embeddingLiteral, k]);

  return res.rows.map((row) => ({
    id: row.id,
    title: row.title,
    source: row.source,
    chunkIndex: row.chunk_index,
    text: row.content,      // handler.js đang dùng p.text
    score: Number(row.score),
  }));
}
