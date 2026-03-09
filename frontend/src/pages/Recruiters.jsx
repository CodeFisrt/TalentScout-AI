import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Recruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiters').then(({ data }) => setRecruiters(data)).catch(() => setRecruiters([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">Recruiter Leads</h1>
      <p className="mt-1 text-slate-400">Contacts from job postings</p>

      {loading ? (
        <div className="mt-8 flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recruiters.map((r) => (
            <div key={r.id} className="saas-card p-5">
              <h3 className="font-semibold text-slate-100">{r.name}</h3>
              <p className="text-sm text-slate-400">{r.company || '—'}</p>
              {r.job_title && <p className="mt-1 text-xs text-slate-500">Job: {r.job_title}</p>}
              <div className="mt-4 flex gap-2">
                {r.linkedin_url && (
                  <a href={r.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                    LinkedIn
                  </a>
                )}
                <button type="button" className="btn-secondary text-sm">Contact</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && recruiters.length === 0 && (
        <p className="mt-6 text-center text-slate-500">No recruiter leads yet.</p>
      )}
    </div>
  );
}
