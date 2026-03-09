import { getJobsCount } from '../models/Job.js';
import { getCandidatesCount } from '../models/Candidate.js';
import { getApplicationsCount } from '../models/Application.js';
import pool from '../config/database.js';

export async function getStats(req, res) {
  try {
    const [totalJobs] = await Promise.all([getJobsCount()]);
    const [totalCandidates] = await Promise.all([getCandidatesCount()]);
    const [totalApplications] = await Promise.all([getApplicationsCount()]);
    const [aiMatched] = await pool.execute(
      'SELECT COUNT(*) as count FROM applications WHERE match_score IS NOT NULL AND match_score >= 50'
    );
    res.json({
      totalJobs,
      aiMatchedJobs: aiMatched[0][0].count,
      candidatesRegistered: totalCandidates,
      applicationsSent: totalApplications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}
