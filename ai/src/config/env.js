import 'dotenv/config';

export const env = {
  port: process.env.PORT || 4100,
  databaseUrl: process.env.DATABASE_URL,
  embeddingDim: parseInt(process.env.EMBEDDING_DIM || '768', 10)
};
