import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import jobsRouter from './routes/jobs.js';
import candidatesRouter from './routes/candidates.js';
import applicationsRouter from './routes/applications.js';
import recruitersRouter from './routes/recruiters.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/recruiters', recruitersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TalentScout AI API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`TalentScout AI API running on http://localhost:${PORT}`);
});
