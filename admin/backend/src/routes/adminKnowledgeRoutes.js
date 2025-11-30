// ai/src/routes/adminKnowledgeRoutes.js
import express from 'express';
import { query } from '../rag/db.js';
import { embedText } from '../rag/embedder.js';

const router = express.Router();

const AI_ADMIN_SECRET = process.env.AI_ADMIN_SECRET;

// check secret – chỉ backend admin được gọi
router.use((req, res, next) => {
  if (!AI_ADMIN_SECRET) {
    console.error('[ai] AI_ADMIN_SECRET chưa cấu hình');
    return res.status(500).json({ error: 'AI admin not configured' });
  }

  const headerSecret = req.headers['x-ai-admin-secret'];
  if (headerSecret !== AI_ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
});

// GET /admin/kb -> list doc (group theo title+source)
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT
        title,
        source,
        COUNT(*) AS chunks,
        MIN(created_at) AS created_at
      FROM knowledge_chunks
      GROUP BY title, source
      ORDER BY created_at DESC;
    `;
    const result = await query(sql, []);
    res.json(result.rows);
  } catch (err) {
    console.error('[ai] /admin/kb GET error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /admin/kb/detail?title=...&source=...
router.get('/detail', async (req, res) => {
  const { title, source } = req.query;
  if (!title) {
    return res.status(400).json({ error: 'Missing title' });
  }

  try {
    const params = [title];
    let sql = `
      SELECT id, title, source, chunk_index, content, created_at
      FROM knowledge_chunks
      WHERE title = $1
    `;

    if (source) {
      sql += ' AND source = $2';
      params.push(source);
    }

    sql += ' ORDER BY chunk_index ASC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('[ai] /admin/kb/detail error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /admin/kb/:id -> 1 chunk
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT id, title, source, chunk_index, content, created_at
      FROM knowledge_chunks
      WHERE id = $1
      LIMIT 1;
    `;
    const result = await query(sql, [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[ai] /admin/kb/:id GET error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /admin/kb  { title, source?, content }
router.post('/', async (req, res) => {
  const { title, source, content } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }

  try {
    const effectiveSource = source || 'admin';
    const chunks = splitIntoChunks(content, 800);

    if (!chunks.length) {
      return res.status(400).json({ error: 'No valid content' });
    }

    const insertSql = `
      INSERT INTO knowledge_chunks (
        id, title, source, chunk_index, content, embedding, created_at
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5::vector,
        NOW()
      );
    `;

    let count = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i].trim();
      if (!chunkText) continue;

      const emb = await embedText(chunkText);
      const literal = '[' + emb.join(',') + ']';

      await query(insertSql, [
        title,
        effectiveSource,
        i,
        chunkText,
        literal,
      ]);
      count++;
    }

    res.status(201).json({ ok: true, inserted: count });
  } catch (err) {
    console.error('[ai] /admin/kb POST error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// PUT /admin/kb/:id  { content }
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body || {};
  if (!content) {
    return res.status(400).json({ error: 'Missing content' });
  }

  try {
    const emb = await embedText(content);
    const literal = '[' + emb.join(',') + ']';

    const sql = `
      UPDATE knowledge_chunks
      SET content = $1,
          embedding = $2::vector,
          created_at = NOW()
      WHERE id = $3
      RETURNING id, title, source, chunk_index, content, created_at;
    `;

    const result = await query(sql, [content, literal, id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[ai] /admin/kb PUT error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// DELETE /admin/kb/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `DELETE FROM knowledge_chunks WHERE id = $1`;
    const result = await query(sql, [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[ai] /admin/kb DELETE error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

function splitIntoChunks(text, maxLen = 800) {
  if (!text) return [];

  const paragraphs = text.split(/\n\s*\n/g);
  const chunks = [];
  let current = '';

  for (const raw of paragraphs) {
    const p = raw.trim();
    if (!p) continue;

    if ((current + '\n\n' + p).length > maxLen && current) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? current + '\n\n' + p : p;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export default router;
