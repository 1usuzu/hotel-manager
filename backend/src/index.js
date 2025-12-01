// backend/src/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { health } from './routes/health.js';

const app = express();
app.use(cors());
app.use(express.json());

// ES modules: tự tạo __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve ảnh uploads (dùng chung thư mục với admin backend)
const uploadsDir = path.join(__dirname, '..', 'admin', 'backend', 'uploads');
console.log('User backend serving uploads dir:', uploadsDir);

app.use('/uploads', express.static(uploadsDir));

// Routes health check
app.use(health);

// TODO: modules/rooms, modules/bookings, modules/payments (team tự cài đặt)

app.listen(env.port, () => {
  console.log(`[backend] running on http://localhost:${env.port}`);
});
