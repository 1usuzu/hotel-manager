import express from 'express';
import { resetConversation } from './chat/handler.js';

const app = express();
app.use(express.json());

app.post('/reset', (req, res) => {
  const { userId, sessionId } = req.body || {};
  resetConversation(userId, sessionId);
  res.json({ ok: true });
});
