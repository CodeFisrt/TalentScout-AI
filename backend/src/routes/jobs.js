import { Router } from 'express';
import { getJobs, getJobById, createJob, getJobMatchScore } from '../controllers/jobsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/', authMiddleware, getJobs);
router.get('/match', authMiddleware, getJobMatchScore);
router.get('/:id', authMiddleware, getJobById);
router.post('/', authMiddleware, createJob);
export default router;
