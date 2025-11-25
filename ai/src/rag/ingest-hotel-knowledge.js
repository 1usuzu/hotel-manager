// ai/src/rag/ingest-hotel-knowledge.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { embedText } from './embedder.js';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeDir = path.join(__dirname, '../../knowledge');
const knowledgeFile = path.join(knowledgeDir, 'hotel_knowledge.txt');

async function main() {
  if (!fs.existsSync(knowledgeFile)) {
    console.error('[ingest] Không tìm thấy file', knowledgeFile);
    process.exit(1);
  }

  const raw = fs.readFileSync(knowledgeFile, 'utf8');

  // Chunk đơn giản: tách theo dòng trống
  const chunks = raw
    .split(/\n\s*\n/g)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  console.log(`[ingest] Tổng số chunk: ${chunks.length}`);

  const source = 'hotel_knowledge.txt';
  const title = 'Kiến thức khách sạn';

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];

    try {
      console.log(`[ingest] Chunk ${i + 1}/${chunks.length}`);
      const embedding = await embedText(content);
      const embeddingLiteral = '[' + embedding.join(',') + ']';

      await query(
        `
        INSERT INTO knowledge_chunks (title, source, chunk_index, content, embedding)
        VALUES ($1, $2, $3, $4, $5::vector)
      `,
        [title, source, i, content, embeddingLiteral]
      );
    } catch (err) {
      console.error(`[ingest] Lỗi chunk ${i}:`, err);
    }
  }

  console.log('[ingest] Hoàn thành ingest hotel_knowledge.txt.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[ingest] Fatal error:', err);
  process.exit(1);
});
