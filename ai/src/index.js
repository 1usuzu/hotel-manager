import express from 'express';
import { env } from './config/env.js';
import { retrieveTopK } from './rag/retriever.js';

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { query, userId } = req.body || {};
  const passages = await retrieveTopK(query, 5);
  // TODO: gọi model Vitral (LMStudio) + prompt + stream
  res.json({ ok: true, userId, query, passages });
});

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'ai', time: new Date().toISOString() });
});

app.listen(env.port, () => {
  console.log(`[ai] running on http://localhost:${env.port}`);
});
