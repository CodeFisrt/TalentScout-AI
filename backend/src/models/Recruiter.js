import pool from '../config/database.js';

export async function getAllRecruiters() {
  const [rows] = await pool.execute(
    `SELECT r.*, j.title as job_title FROM recruiters r LEFT JOIN jobs j ON r.job_id = j.id ORDER BY r.id DESC`
  );
  return rows;
}

export async function createRecruiter(data) {
  const [result] = await pool.execute(
    `INSERT INTO recruiters (name, company, linkedin_url, job_id) VALUES (?, ?, ?, ?)`,
    [data.name, data.company || '', data.linkedin_url || '', data.job_id || null]
  );
  return result.insertId;
}

export async function getRecruitersCount() {
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM recruiters');
  return rows[0].count;
}
