import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 4100,
  dbUrl: process.env.DATABASE_URL,
  embeddingDim: parseInt(process.env.EMBEDDING_DIM || '768', 10),
  backendUrl: process.env.BACKEND_URL || 'http://localhost:4000',
  chatUrl: process.env.CHAT_URL,
  chatModel: process.env.CHAT_MODEL
};

if (!env.dbUrl) {
  throw new Error('[ai] DATABASE_URL chưa được cấu hình trong .env');
}
