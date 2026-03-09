import { Router } from 'express';
import { getRecruiters } from '../controllers/recruitersController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/', authMiddleware, getRecruiters);
export default router;
