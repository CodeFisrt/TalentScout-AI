export default function JobCard({ job, onApply }) {
  const score = job.ai_match_score != null ? Number(job.ai_match_score) : null;
  const scoreClass = score >= 70 ? 'match-high' : score >= 40 ? 'match-mid' : 'match-low';

  return (
    <div className="saas-card flex flex-col gap-3 p-4 transition hover:border-slate-600/80">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-100">{job.title}</h3>
          <p className="text-sm text-slate-400">{job.company}</p>
        </div>
        {score != null && (
          <span className={`match-badge ${scoreClass}`}>Match {Math.round(score)}%</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        {job.location && <span>{job.location}</span>}
        {job.experience && <span>• {job.experience}</span>}
      </div>
      {job.skills && (
        <p className="line-clamp-2 text-sm text-slate-400">{job.skills}</p>
      )}
      <div className="mt-auto flex gap-2">
        {job.job_link && (
          <a
            href={job.job_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            View job
          </a>
        )}
        {onApply && (
          <button type="button" onClick={() => onApply(job)} className="btn-primary text-sm">
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
