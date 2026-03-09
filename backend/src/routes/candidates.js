import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCandidates, getCandidateById, createCandidate, updateCandidate } from '../controllers/candidatesController.js';
import { authMiddleware } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`),
});
const upload = multer({ storage });

const router = Router();
router.use(authMiddleware);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.post('/', upload.single('resume'), createCandidate);
router.put('/:id', upload.single('resume'), updateCandidate);
export default router;
