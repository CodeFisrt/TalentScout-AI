import pool from '../config/database.js';

export async function getAllJobs(filters = {}) {
  let sql = `
    SELECT j.*, COALESCE(am.avg_score, 0) as ai_match_score
    FROM jobs j
    LEFT JOIN (
      SELECT job_id, AVG(match_score) as avg_score FROM applications GROUP BY job_id
    ) am ON j.id = am.job_id
    WHERE 1=1
  `;
  const params = [];

  if (filters.technology) {
    sql += ' AND (j.skills LIKE ? OR j.title LIKE ?)';
    const term = `%${filters.technology}%`;
    params.push(term, term);
  }
  if (filters.experience) {
    sql += ' AND j.experience LIKE ?';
    params.push(`%${filters.experience}%`);
  }
  if (filters.location) {
    sql += ' AND j.location LIKE ?';
    params.push(`%${filters.location}%`);
  }
  if (filters.remote !== undefined && filters.remote !== '') {
    if (filters.remote === 'remote') {
      sql += ' AND (j.location LIKE ? OR j.location LIKE ?)';
      params.push('%Remote%', '%remote%');
    } else if (filters.remote === 'onsite') {
      sql += ' AND j.location NOT LIKE ? AND j.location NOT LIKE ?';
      params.push('%Remote%', '%remote%');
    }
  }

  sql += ' ORDER BY j.posted_date DESC';
  if (filters.limit) sql += ' LIMIT ?';
  if (filters.offset) sql += ' OFFSET ?';
  if (filters.limit) params.push(parseInt(filters.limit, 10));
  if (filters.offset) params.push(parseInt(filters.offset, 10));

  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function getJobById(id) {
  const [rows] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
  return rows[0];
}

export async function createJob(data) {
  const [result] = await pool.execute(
    `INSERT INTO jobs (title, company, location, skills, experience, description, job_link, posted_date, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.company,
      data.location || '',
      data.skills || '',
      data.experience || '',
      data.description || '',
      data.job_link || '',
      data.posted_date || new Date().toISOString().slice(0, 10),
      data.source || 'linkedin',
    ]
  );
  return result.insertId;
}

export async function jobExistsByLink(jobLink) {
  const [rows] = await pool.execute('SELECT id FROM jobs WHERE job_link = ?', [jobLink]);
  return rows.length > 0;
}

export async function getJobsCount() {
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM jobs');
  return rows[0].count;
}
