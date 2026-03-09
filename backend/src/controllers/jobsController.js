import * as JobModel from '../models/Job.js';
import { getApplicationById, setApplicationMatchScore } from '../models/Application.js';
import { getCandidateById } from '../models/Candidate.js';
import { getMatchScore } from '../ai/matchingService.js';

export async function getJobs(req, res) {
  try {
    const filters = {
      technology: req.query.technology,
      experience: req.query.experience,
      location: req.query.location,
      remote: req.query.remote,
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
    };
    const jobs = await JobModel.getAllJobs(filters);
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
}

export async function getJobById(req, res) {
  try {
    const job = await JobModel.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
}

export async function createJob(req, res) {
  try {
    const id = await JobModel.createJob(req.body);
    res.status(201).json({ id, message: 'Job created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
}

export async function getJobMatchScore(req, res) {
  try {
    const { jobId, candidateId } = req.query;
    if (!jobId || !candidateId) return res.status(400).json({ error: 'jobId and candidateId required' });
    const job = await JobModel.getJobById(jobId);
    const candidate = await getCandidateById(candidateId);
    if (!job || !candidate) return res.status(404).json({ error: 'Job or candidate not found' });
    const score = await getMatchScore(job.description || job.skills, candidate.skills);
    res.json({ matchScore: score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute match score' });
  }
}
