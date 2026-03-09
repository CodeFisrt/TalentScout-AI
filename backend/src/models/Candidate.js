import pool from '../config/database.js';

export async function getAllCandidates() {
  const [rows] = await pool.execute('SELECT * FROM candidates ORDER BY id DESC');
  return rows;
}

export async function getCandidateById(id) {
  const [rows] = await pool.execute('SELECT * FROM candidates WHERE id = ?', [id]);
  return rows[0];
}

export async function createCandidate(data) {
  const [result] = await pool.execute(
    `INSERT INTO candidates (name, skills, experience, email, phone, resume_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.skills || '',
      data.experience || '',
      data.email || '',
      data.phone || '',
      data.resume_url || null,
    ]
  );
  return result.insertId;
}

export async function updateCandidate(id, data) {
  await pool.execute(
    `UPDATE candidates SET name = ?, skills = ?, experience = ?, email = ?, phone = ?, resume_url = COALESCE(?, resume_url) WHERE id = ?`,
    [data.name, data.skills || '', data.experience || '', data.email || '', data.phone || '', data.resume_url, id]
  );
  return id;
}

export async function getCandidatesCount() {
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM candidates');
  return rows[0].count;
}
