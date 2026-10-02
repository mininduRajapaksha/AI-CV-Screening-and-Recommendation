import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, GraduationCap, Briefcase, AlertTriangle, CheckCircle2 } from 'lucide-react';
import candidates from '../mocks/candidates.json';
import ProgressRing from '../components/ui/ProgressRing';
import StatusPill from '../components/ui/StatusPill';

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const c = candidates.find((x) => x.candidateId === candidateId) || candidates[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{c.name}</h1>
          <p className="text-sm text-slate-500">{c.appliedRole}</p>
        </div>
        <StatusPill value={c.recommendation} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col items-center">
          <ProgressRing value={c.matchPercent} size={120} />
          <p className="text-sm text-slate-500 mt-4">AI Match Percentage</p>
          <p className="text-xs text-slate-400 mt-1">Rank #{c.rank}</p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> Missing Skills
          </h2>
          {c.missingSkills?.length ? (
            <div className="flex flex-wrap gap-2">
              {c.missingSkills.map((s) => (
                <span key={s} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-emerald-600 flex items-center gap-2">
              <CheckCircle2 size={16} /> No missing skills  strong match on all requirements
            </p>
          )}
        </div>

        <div className="card p-6 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Info icon={Mail} label="Email">candidate@example.com</Info>
          <Info icon={Phone} label="Phone">+94 77 123 4567</Info>
          <Info icon={GraduationCap} label="Education">BSc Computer Science</Info>
          <Info icon={Briefcase} label="Experience">5+ years</Info>
        </div>
      </div>

      <p className="text-xs text-center text-slate-400">
        Placeholder screen  full candidate profile will be built by teammate.
      </p>
    </div>
  );
}

function Info({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-slate-600" />
      </div>
      <div>
        <div className="text-xs uppercase text-slate-400 font-semibold">{label}</div>
        <div className="text-sm text-slate-800 mt-0.5">{children}</div>
      </div>
    </div>
  );
}
