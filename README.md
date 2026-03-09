# TalentScout AI

Fullstack AI-powered job searching platform. Automatically finds jobs from LinkedIn and other sources, stores them in MySQL, and matches them with candidates using OpenAI.

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Axios, React Router
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Automation:** Playwright (scraping), node-cron (scheduler)
- **AI:** OpenAI API for job–candidate matching

## Setup

### 1. Database

1. Create a MySQL database (e.g. `talentscout_ai`).
2. Run migrations in phpMyAdmin or MySQL client:
   - `backend/migrations/001_initial_schema.sql` (creates all tables)

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: DB_*, JWT_SECRET, OPENAI_API_KEY
npm install
npm run seed   # optional: creates demo@talentscout.ai / demo123
npm run dev    # start API on http://localhost:5000
```

Optional (separate terminal):

- `npm run scrape` — run job scraper once
- `npm run scheduler` — run cron (scrape every 3 hours)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

### 4. Login

- Register via API or use seed user: **demo@talentscout.ai** / **demo123**

## Project Structure

```
TalentScout-AI/
├── frontend/          # React Vite app
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── ai/           # OpenAI matching
│   │   ├── scraper/       # Playwright LinkedIn scraper
│   │   └── scheduler.js   # node-cron
│   ├── migrations/       # SQL for phpMyAdmin
│   ├── scripts/          # seed demo user
│   └── uploads/           # resume uploads
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/dashboard/stats | Dashboard metrics |
| GET | /api/jobs | List jobs (filters: technology, experience, location, remote) |
| GET | /api/jobs/:id | Job by ID |
| POST | /api/jobs | Create job |
| GET | /api/candidates | List candidates |
| POST | /api/candidates | Create candidate (multipart for resume) |
| GET | /api/applications | List applications |
| POST | /api/applications | Create application (AI match computed) |
| PATCH | /api/applications/:id/status | Update status (job_found, applied, interview, offer) |
| GET | /api/recruiters | List recruiter leads |

## Features

- **Dashboard:** Total jobs, AI matched jobs, candidates, applications
- **Jobs:** Table/card view, filters (technology, experience, location, remote/onsite), Apply with candidate (creates application + AI score)
- **Candidates:** Cards, add candidate, resume upload
- **Applications:** Pipeline stages (Job Found → Applied → Interview → Offer), status update, AI match badge
- **Recruiter Leads:** Name, company, LinkedIn, contact

## Notes

- **LinkedIn scraping:** LinkedIn may require login or show captchas. The scraper is structured for LinkedIn jobs search; for production consider official APIs or other job board APIs.
- **OpenAI:** Set `OPENAI_API_KEY` in backend `.env` for real match scores; otherwise a fallback score is used.
