// backend/src/routes/health.js
import { Router } from 'express';

const health = Router();

health.get('/health', (req, res) => {
  res.json({ ok: true, service: 'backend', time: new Date().toISOString() });
});

// Named export: { health }
export { health };
