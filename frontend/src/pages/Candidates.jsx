import { useState, useEffect } from 'react';
import api from '../api/axios';
import CandidateCard from '../components/CandidateCard';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', skills: '', experience: '', email: '', phone: '' });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    api.get('/candidates').then(({ data }) => setCandidates(data)).catch(() => setCandidates([])).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (resumeFile) fd.append('resume', resumeFile);
    try {
      await api.post('/candidates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ name: '', skills: '', experience: '', email: '', phone: '' });
      setResumeFile(null);
      setShowForm(false);
      const { data } = await api.get('/candidates');
      setCandidates(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Candidates</h1>
          <p className="mt-1 text-slate-400">Manage candidates and resumes</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add candidate'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="saas-card mt-6 space-y-4 p-6">
          <input className="saas-input" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <input className="saas-input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input className="saas-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <input className="saas-input" placeholder="Skills (comma-separated)" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
          <input className="saas-input" placeholder="Experience" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} />
          <div>
            <label className="block text-sm text-slate-400">Resume (optional)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0])} className="mt-1 text-sm text-slate-300" />
          </div>
          <button type="submit" className="btn-primary">Save candidate</button>
        </form>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      )}
      {!loading && candidates.length === 0 && (
        <p className="mt-6 text-center text-slate-500">No candidates yet. Add one above.</p>
      )}
    </div>
  );
}
