import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await api.post('/auth/register', { name, email, password });
        const { data } = await api.post('/auth/login', { email, password });
        login(data.user, data.token);
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        login(data.user, data.token);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || (mode === 'register' ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-white text-center">TalentScout AI</h1>
        <p className="mt-1 text-center text-slate-400">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-lg bg-rose-500/15 px-4 py-3 text-sm text-rose-400">{error}</div>
          )}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="saas-input mt-1" placeholder="Your name" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="saas-input mt-1" placeholder="you@company.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="saas-input mt-1" placeholder="••••••••" required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (mode === 'register' ? 'Creating account...' : 'Signing in...') : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
          <p className="text-center text-sm text-slate-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-primary-400 hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Demo: run <code className="rounded bg-slate-800 px-1">npm run seed</code> in backend, then login with demo@talentscout.ai / demo123
        </p>
      </div>
    </div>
  );
}
