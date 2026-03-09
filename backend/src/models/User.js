import pool from '../config/database.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

export async function createUser(name, email, passwordHash) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result.insertId;
}

export async function findUserById(id) {
  const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return rows[0];
}
