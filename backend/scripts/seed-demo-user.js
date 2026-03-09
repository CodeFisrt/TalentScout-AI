import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from '../src/config/database.js';

async function seed() {
  const hash = await bcrypt.hash('demo123', 10);
  await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
    ['Demo User', 'demo@talentscout.ai', hash]
  );
  console.log('Demo user created: demo@talentscout.ai / demo123');
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
