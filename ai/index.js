import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { retrieveTopK } from './rag/retriever.js';
import { chatWithRag } from './chat/handler.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'ai', time: new Date().toISOString() });
});

// Test RAG
app.post('/chat/test-rag', async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'query is required' });
    }

    const passages = await retrieveTopK(query, 5);

    res.json({
      ok: true,
      query,
      passages
    });
  } catch (err) {
    console.error('[ai] /chat/test-rag error:', err);
    res.status(500).json({ error: 'Internal AI error' });
  }
});

// Chat đầy đủ (RAG + Vistral)
app.post('/chat', async (req, res) => {
  try {
    const { query, userId } = req.body || {};

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'query is required' });
    }

    const { answer, passages } = await chatWithRag({ query, userId });

    res.json({
      ok: true,
      query,
      answer,
      context: passages
    });
  } catch (err) {
    console.error('[ai] /chat error:', err);
    res.status(500).json({ error: 'Internal AI error' });
  }
});

app.listen(env.port, () => {
  console.log(`[ai] running on http://localhost:${env.port}`);
});
