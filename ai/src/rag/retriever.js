// ai/src/rag/retriever.js
import { query } from './db.js';
import { embedText } from './embedder.js';

export async function retrieveTopK(userQuery, k = 5) {
  if (!userQuery || !userQuery.trim()) return [];

  // 1. Embed câu hỏi
  const embedding = await embedText(userQuery);
  if (!embedding.length) return [];

  // 2. Build literal cho pgvector
  const embeddingLiteral = '[' + embedding.join(',') + ']';

  // 3. Query top-k bằng cosine distance
  const sql = `
    SELECT
      id,
      title,
      source,
      chunk_index,
      content,
      1 - (embedding <=> $1::vector) AS score
    FROM knowledge_chunks
    ORDER BY embedding <=> $1::vector
    LIMIT $2;
  `;

  const res = await query(sql, [embeddingLiteral, k]);

  return res.rows.map((row) => ({
    id: row.id,
    title: row.title,
    source: row.source,
    chunkIndex: row.chunk_index,
    text: row.content,
    score: Number(row.score)
  }));
}
