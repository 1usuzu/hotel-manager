import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { health } from './routes/health.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(health);

// TODO: modules/rooms, modules/bookings, modules/payments (team tự cài đặt)

app.listen(env.port, () => {
  console.log(`[backend] running on http://localhost:${env.port}`);
});
