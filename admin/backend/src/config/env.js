require('dotenv').config();

const env = {
  port: process.env.PORT || 4001,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  databaseUrl: process.env.DATABASE_URL,
};

module.exports = { env };
