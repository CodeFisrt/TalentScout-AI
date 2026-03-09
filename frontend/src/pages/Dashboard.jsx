import { useState, useEffect } from 'react';
import api from '../api/axios';
import AnalyticsCards from '../components/AnalyticsCards';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => { setStats(data); }).catch(() => setStats({ totalJobs: 0, aiMatchedJobs: 0, candidatesRegistered: 0, applicationsSent: 0 })).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-slate-400">Overview of your TalentScout AI metrics</p>
      <div className="mt-8">
        <AnalyticsCards stats={stats} />
      </div>
    </div>
  );
}
