import * as CandidateModel from '../models/Candidate.js';

export async function getCandidates(req, res) {
  try {
    const candidates = await CandidateModel.getAllCandidates();
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
}

export async function getCandidateById(req, res) {
  try {
    const candidate = await CandidateModel.getCandidateById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
}

export async function createCandidate(req, res) {
  try {
    const data = { ...req.body };
    if (req.file) data.resume_url = `/uploads/${req.file.filename}`;
    const id = await CandidateModel.createCandidate(data);
    res.status(201).json({ id, message: 'Candidate created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
}

export async function updateCandidate(req, res) {
  try {
    const data = { ...req.body };
    if (req.file) data.resume_url = `/uploads/${req.file.filename}`;
    await CandidateModel.updateCandidate(req.params.id, data);
    res.json({ message: 'Candidate updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
}
