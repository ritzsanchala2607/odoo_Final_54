require('dotenv').config();

module.exports = {
  url: process.env.DATABASE_URL || null,
  username: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'quickcourt_db',
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
  ssl: process.env.DB_CA ,
};

