import * as ApplicationModel from '../models/Application.js';
import { getMatchScore } from '../ai/matchingService.js';
import { getJobById } from '../models/Job.js';
import { getCandidateById } from '../models/Candidate.js';

export async function getApplications(req, res) {
  try {
    const applications = await ApplicationModel.getAllApplications();
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

export async function createApplication(req, res) {
  try {
    const { candidate_id, job_id, status } = req.body;
    if (!candidate_id || !job_id) return res.status(400).json({ error: 'candidate_id and job_id required' });
    const job = await getJobById(job_id);
    const candidate = await getCandidateById(candidate_id);
    if (!job || !candidate) return res.status(404).json({ error: 'Job or candidate not found' });
    let matchScore = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        matchScore = await getMatchScore(job.description || job.skills, candidate.skills);
      } catch (e) {
        console.warn('AI match score failed:', e.message);
      }
    }
    const id = await ApplicationModel.createApplication(candidate_id, job_id, status || 'applied', matchScore);
    res.status(201).json({ id, matchScore, message: 'Application created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create application' });
  }
}

export async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['job_found', 'applied', 'interview', 'offer'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });
    await ApplicationModel.updateApplicationStatus(req.params.id, status);
    res.json({ message: 'Application updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
}
