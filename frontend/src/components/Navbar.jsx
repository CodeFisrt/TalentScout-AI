import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-lg font-semibold text-slate-100 lg:hidden">TalentScout AI</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">{user?.email}</span>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/60"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
