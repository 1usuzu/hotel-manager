// ai/src/index.js
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { retrieveTopK } from './rag/retriever.js';
import { chatWithRag } from './chat/handler.js';
import adminKnowledgeRoutes from './routes/adminKnowledgeRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'ai', time: new Date().toISOString() });
});

// // Test RAG thô (không qua Vistral)
// app.post('/chat/test-rag', async (req, res) => {
//   try {
//     const { query } = req.body || {};
//     if (!query || !query.trim()) {
//       return res.status(400).json({ error: 'query is required' });
//     }

//     const passages = await retrieveTopK(query, 5);

//     res.json({
//       ok: true,
//       query,
//       passages
//     });
//   } catch (err) {
//     console.error('[ai] /chat/test-rag error:', err);
//     res.status(500).json({ error: 'Internal AI error' });
//   }
// });

// POST /chat
app.post('/chat', async (req, res) => {
  try {
    const { message, query, userId, accessToken } = req.body || {};
    const finalQuery = message || query;

    if (!finalQuery || !String(finalQuery).trim()) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const { answer, passages } = await chatWithRag({
      query: String(finalQuery),
      userId,
      accessToken,
    });

    res.json({
      ok: true,
      query: finalQuery,
      answer,
      context: passages,
    });
  } catch (err) {
    console.error('[ai] /chat error:', err);
    res.status(500).json({ error: 'Internal AI error' });
  }
});

// Admin knowledge endpoints (backend admin sẽ proxy sang)
app.use('/admin/kb', adminKnowledgeRoutes);

app.listen(env.port, () => {
  console.log(`[ai] running on http://localhost:${env.port}`);
});
