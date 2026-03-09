import { useState, useEffect } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import JobCard from '../components/JobCard';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ technology: '', experience: '', location: '', remote: '' });
  const [view, setView] = useState('table');
  const [applyModal, setApplyModal] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.technology) params.set('technology', filters.technology);
    if (filters.experience) params.set('experience', filters.experience);
    if (filters.location) params.set('location', filters.location);
    if (filters.remote) params.set('remote', filters.remote);
    api.get(`/jobs?${params}`).then(({ data }) => setJobs(data)).catch(() => setJobs([])).finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    if (applyModal) api.get('/candidates').then(({ data }) => setCandidates(data)).catch(() => setCandidates([]));
  }, [applyModal]);

  function handleApply(job) {
    setApplyModal({ job });
  }

  async function submitApplication(candidateId) {
    if (!applyModal?.job) return;
    try {
      await api.post('/applications', { candidate_id: candidateId, job_id: applyModal.job.id, status: 'applied' });
      setApplyModal(null);
    } catch (err) {
      console.error(err);
    }
  }

  const columns = [
    { key: 'title', label: 'Job Title' },
    { key: 'company', label: 'Company' },
    { key: 'location', label: 'Location' },
    { key: 'experience', label: 'Experience' },
    { key: 'ai_match_score', label: 'AI Match' },
    { key: 'actions', label: '' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-white">Jobs</h1>
        <div className="flex gap-2">
          <button onClick={() => setView('table')} className={`rounded-lg px-3 py-2 text-sm ${view === 'table' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-slate-800'}`}>Table</button>
          <button onClick={() => setView('cards')} className={`rounded-lg px-3 py-2 text-sm ${view === 'cards' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-slate-800'}`}>Cards</button>
        </div>
      </div>
      <p className="mt-1 text-slate-400">Browse and filter jobs from LinkedIn and other sources</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Technology"
          value={filters.technology}
          onChange={(e) => setFilters((f) => ({ ...f, technology: e.target.value }))}
          className="saas-input max-w-[180px]"
        />
        <input
          type="text"
          placeholder="Experience"
          value={filters.experience}
          onChange={(e) => setFilters((f) => ({ ...f, experience: e.target.value }))}
          className="saas-input max-w-[180px]"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
          className="saas-input max-w-[180px]"
        />
        <select
          value={filters.remote}
          onChange={(e) => setFilters((f) => ({ ...f, remote: e.target.value }))}
          className="saas-input max-w-[140px]"
        >
          <option value="">All</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" /></div>
      ) : view === 'cards' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => <JobCard key={job.id} job={job} onApply={handleApply} />)}
        </div>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={columns}
            data={jobs}
            emptyMessage="No jobs found. Run the scraper or add jobs manually."
            renderRow={(row) => (
              <tr key={row.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium text-slate-200">{row.title}</td>
                <td className="px-4 py-3 text-slate-400">{row.company}</td>
                <td className="px-4 py-3 text-slate-400">{row.location || '—'}</td>
                <td className="px-4 py-3 text-slate-400">{row.experience || '—'}</td>
                <td className="px-4 py-3">
                  {row.ai_match_score != null ? (
                    <span className={Number(row.ai_match_score) >= 70 ? 'match-badge match-high' : Number(row.ai_match_score) >= 40 ? 'match-badge match-mid' : 'match-badge match-low'}>
                      {Math.round(Number(row.ai_match_score))}%
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => handleApply(row)} className="btn-primary text-xs py-1.5 px-2">Apply</button>
                  {row.job_link && (
                    <a href={row.job_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-primary-400 hover:underline">Open</a>
                  )}
                </td>
              </tr>
            )}
          />
        </div>
      )}

      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setApplyModal(null)}>
          <div className="saas-card max-h-[80vh] w-full max-w-md overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold text-white">Apply to {applyModal.job.title}</h3>
            <p className="mt-1 text-sm text-slate-400">Select a candidate to create application (AI match score will be computed).</p>
            <ul className="mt-4 space-y-2">
              {candidates.length === 0 ? (
                <li className="text-slate-500">No candidates. Add one in Candidates page.</li>
              ) : (
                candidates.map((c) => (
                  <li key={c.id} className="flex items-center justify-between rounded-lg border border-slate-600 bg-slate-800/40 p-3">
                    <span className="text-slate-200">{c.name}</span>
                    <button type="button" onClick={() => submitApplication(c.id)} className="btn-primary text-sm">Apply</button>
                  </li>
                ))
              )}
            </ul>
            <button type="button" onClick={() => setApplyModal(null)} className="btn-secondary mt-4 w-full">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
