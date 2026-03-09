import { Router } from 'express';
import { getApplications, createApplication, updateApplicationStatus } from '../controllers/applicationsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);
router.get('/', getApplications);
router.post('/', createApplication);
router.patch('/:id/status', updateApplicationStatus);
export default router;
