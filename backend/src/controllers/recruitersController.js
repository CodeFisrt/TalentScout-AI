import * as RecruiterModel from '../models/Recruiter.js';

export async function getRecruiters(req, res) {
  try {
    const recruiters = await RecruiterModel.getAllRecruiters();
    res.json(recruiters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recruiters' });
  }
}
