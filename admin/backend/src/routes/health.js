const express = require('express');
const health = express.Router();

health.get('/health', (req, res) => {
  res.json({ ok: true, service: 'backend', time: new Date().toISOString() });
});

module.exports = { health };
