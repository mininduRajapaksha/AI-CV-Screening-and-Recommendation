import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Download, FileText, SlidersHorizontal, Users, ThumbsUp, Target, Bookmark } from 'lucide-react';
import candidates from '../../mocks/candidates.json';
import jobs from '../../mocks/jobs.json';
import StatCard from '../../components/ui/StatCard';
import StatusPill from '../../components/ui/StatusPill';
import ProgressRing from '../../components/ui/ProgressRing';
import FilterPanel from './FilterPanel';
import ExportCsvModal from './ExportCsvModal';
import ExportPdfModal from './ExportPdfModal';

export default function CandidateRanking() {
  const { id, jobId } = useParams();
  const currentJobId = jobId || id;
  const job = jobs.find((j) => j._id === currentJobId) || jobs[0];

  const [showFilters, setShowFilters] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    recommendation: ['Highly Recommended', 'Recommended', 'Not Recommended'],
    range: [50, 100],
    experience: '',
    skills: [],
  });

  const filtered = useMemo(() => candidates.filter((c) =>
    (!query || c.name.toLowerCase().includes(query.toLowerCase())) &&
    filters.recommendation.includes(c.recommendation) &&
    c.matchPercent >= filters.range[0] && c.matchPercent <= filters.range[1]
  ), [query, filters]);

  const stats = useMemo(() => ({
    total: candidates.length,
    highly: candidates.filter((c) => c.recommendation === 'Highly Recommended').length,
    avg: Math.round(candidates.reduce((a, c) => a + c.matchPercent, 0) / candidates.length),
    shortlisted: 42,
  }), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Matching & Candidate Ranking</h1>
          <p className="text-sm text-slate-500">AI-ranked candidates optimized for the {job.title} profile</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCsv(true)} className="btn-secondary flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => setShowPdf(true)} className="btn-primary flex items-center gap-2">
            <FileText size={16} /> Generate PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Applicants" value={stats.total} hint="+28 this week" icon={Users} />
        <StatCard label="Highly Recommended" value={stats.highly} hint="Top 7% of applicants" icon={ThumbsUp} />
        <StatCard label="Average Match %" value={`${stats.avg}%`} hint="Across all applications" icon={Target} />
        <StatCard label="Shortlisted" value={stats.shortlisted} hint="12% of total pipeline" icon={Bookmark} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search candidate by name" className="input-field pl-10" />
        </div>
        <button onClick={() => setShowFilters(true)} className="btn-secondary flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Candidate Name</th>
              <th className="px-6 py-3">Applied For</th>
              <th className="px-6 py-3">AI Match</th>
              <th className="px-6 py-3">Recommendation</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.candidateId} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-500">#{String(c.rank).padStart(2, '0')}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-slate-600">{c.appliedRole}</td>
                <td className="px-6 py-4"><ProgressRing value={c.matchPercent} /></td>
                <td className="px-6 py-4"><StatusPill value={c.recommendation} /></td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/candidates/${c.candidateId}`} className="btn-secondary text-xs px-3 py-1.5 inline-block">View Profile</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">No candidates match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <FilterPanel open={showFilters} onClose={() => setShowFilters(false)} filters={filters} setFilters={setFilters} jobSkills={job.skills || []} />
      <ExportCsvModal open={showCsv} onClose={() => setShowCsv(false)} jobTitle={job.title} />
      <ExportPdfModal open={showPdf} onClose={() => setShowPdf(false)} jobTitle={job.title} />
    </div>
  );
}
