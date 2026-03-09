export default function CandidateCard({ candidate, onSelect }) {
  return (
    <div className="saas-card p-5 transition hover:border-slate-600/80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100">{candidate.name}</h3>
          {candidate.email && <p className="text-sm text-slate-400">{candidate.email}</p>}
        </div>
        {candidate.resume_url && (
          <a
            href={candidate.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded bg-slate-700/60 px-2 py-1 text-xs text-primary-400 hover:bg-slate-600/60"
          >
            Resume
          </a>
        )}
      </div>
      {candidate.skills && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">{candidate.skills}</p>
      )}
      {candidate.experience && (
        <p className="mt-1 text-xs text-slate-500">Experience: {candidate.experience}</p>
      )}
      {onSelect && (
        <button type="button" onClick={() => onSelect(candidate)} className="btn-primary mt-4 w-full text-sm">
          Select
        </button>
      )}
    </div>
  );
}
