import pool from '../config/database.js';

export async function getAllApplications() {
  const [rows] = await pool.execute(
    `SELECT a.*, j.title as job_title, j.company, j.location, c.name as candidate_name, c.skills as candidate_skills, c.email as candidate_email
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     JOIN candidates c ON a.candidate_id = c.id
     ORDER BY a.applied_date DESC`
  );
  return rows;
}

export async function createApplication(candidateId, jobId, status = 'applied', matchScore = null) {
  const [result] = await pool.execute(
    `INSERT INTO applications (candidate_id, job_id, status, applied_date, match_score)
     VALUES (?, ?, ?, ?, ?)`,
    [candidateId, jobId, status, new Date().toISOString().slice(0, 19).replace('T', ' '), matchScore]
  );
  return result.insertId;
}

export async function updateApplicationStatus(id, status) {
  await pool.execute('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
  return id;
}

export async function getApplicationsCount() {
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM applications');
  return rows[0].count;
}

export async function getApplicationsByStatus(status) {
  const [rows] = await pool.execute(
    `SELECT a.*, j.title as job_title, j.company, c.name as candidate_name
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     JOIN candidates c ON a.candidate_id = c.id
     WHERE a.status = ?
     ORDER BY a.applied_date DESC`,
    [status]
  );
  return rows;
}

export async function getApplicationById(id) {
  const [rows] = await pool.execute(
    `SELECT a.*, j.title as job_title, j.company, j.description, c.name as candidate_name, c.skills as candidate_skills
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     JOIN candidates c ON a.candidate_id = c.id
     WHERE a.id = ?`,
    [id]
  );
  return rows[0];
}

export async function setApplicationMatchScore(applicationId, score) {
  await pool.execute('UPDATE applications SET match_score = ? WHERE id = ?', [score, applicationId]);
}
