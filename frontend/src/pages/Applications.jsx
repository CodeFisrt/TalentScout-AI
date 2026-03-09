import { useState, useEffect } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';

const STAGES = ['job_found', 'applied', 'interview', 'offer'];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState('all');

  useEffect(() => {
    api.get('/applications').then(({ data }) => setApplications(data)).catch(() => setApplications([])).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = groupBy === 'all' ? applications : applications.filter((a) => a.status === groupBy);

  const columns = [
    { key: 'job_title', label: 'Job' },
    { key: 'company', label: 'Company' },
    { key: 'candidate_name', label: 'Candidate' },
    { key: 'status', label: 'Stage' },
    { key: 'match_score', label: 'Match' },
    { key: 'actions', label: '' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">Applications</h1>
      <p className="mt-1 text-slate-400">Pipeline: Job Found → Applied → Interview → Offer</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setGroupBy('all')}
          className={`rounded-lg px-3 py-2 text-sm ${groupBy === 'all' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          All
        </button>
        {STAGES.map((s) => (
          <button
            key={s}
            onClick={() => setGroupBy(s)}
            className={`rounded-lg px-3 py-2 text-sm capitalize ${groupBy === s ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" /></div>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No applications yet."
            renderRow={(row) => (
              <tr key={row.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium text-slate-200">{row.job_title}</td>
                <td className="px-4 py-3 text-slate-400">{row.company}</td>
                <td className="px-4 py-3 text-slate-400">{row.candidate_name}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.status}
                    onChange={(e) => updateStatus(row.id, e.target.value)}
                    className="saas-input py-1.5 text-sm"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {row.match_score != null ? (
                    <span className={Number(row.match_score) >= 70 ? 'match-badge match-high' : Number(row.match_score) >= 40 ? 'match-badge match-mid' : 'match-badge match-low'}>
                      {Math.round(Number(row.match_score))}%
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">—</td>
              </tr>
            )}
          />
        </div>
      )}
    </div>
  );
}
