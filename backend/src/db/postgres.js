import pg from 'pg';

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

export const pool = new Pool({
  connectionString: dbUrl,
});

export const db = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      console.error('DB Query Error:', err);
      throw err;
    }
  }
};
