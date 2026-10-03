import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Download, FileText, SlidersHorizontal, Users, ThumbsUp, Target, Bookmark, Loader2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import StatusPill from '../../components/ui/StatusPill';
import ProgressRing from '../../components/ui/ProgressRing';
import FilterPanel from './FilterPanel';
import ExportCsvModal from './ExportCsvModal';
import ExportPdfModal from './ExportPdfModal';

export default function CandidateRanking() {
  const { id, jobId } = useParams();
  const currentJobId = jobId || id;

  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState({ title: 'Loading...', skills: [] }); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const [showFilters, setShowFilters] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [query, setQuery] = useState('');
  
  const [filters, setFilters] = useState({
    recommendation: ['Highly Recommended', 'Recommended', 'Not Recommended', 'Pending'],
    range: [0, 100], 
    experience: '',
    skills: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const jobRes = await axios.get(`http://localhost:5000/api/jobs/${currentJobId}`);
          const jobData = jobRes.data?.job || jobRes.data?.data || jobRes.data;
          if (jobData && jobData.title) {
            setJob(jobData);
          } else {
             setJob({ title: 'Unknown Job Role', skills: [] });
          }
        } catch (jobErr) {
          console.error("Could not load job details.", jobErr);
          setJob({ title: 'Unknown Job Role', skills: [] });
        }

        const candidatesRes = await axios.get(`http://localhost:5000/api/reports/${currentJobId}/ranking`);
        const candidateData = candidatesRes.data?.data || candidatesRes.data;
        
        if (candidateData && Array.isArray(candidateData)) {
           setCandidates(candidateData);
        }
      } catch (error) {
        console.error("Error fetching integration data:", error);
        setError("Failed to load candidate data from the server. Please check your backend connection.");
      } finally {
        setLoading(false);
      }
    };

    if (currentJobId) fetchReportData();
  }, [currentJobId]);

  // Real data filtering based on reportController.js outputs
  const filtered = useMemo(() => candidates.filter((c) => {
    const cName = c.name || "";
    const nameMatch = !query || (cName.toLowerCase().includes(query.toLowerCase()));
    
    const cRec = c.recommendation || 'Pending';
    const recMatch = filters.recommendation.includes(cRec);
    
    const cMatch = c.matchPercent || 0;
    const rangeMatch = cMatch >= filters.range[0] && cMatch <= filters.range[1];
    
    return nameMatch && recMatch && rangeMatch;
  }), [query, filters, candidates]);

  const stats = useMemo(() => {
    if (candidates.length === 0) return { total: 0, highly: 0, avg: 0, shortlisted: 0 };
    
    const processedCandidates = candidates.filter(c => (c.matchPercent || 0) > 0);
    const avgMatch = processedCandidates.length > 0 
       ? Math.round(processedCandidates.reduce((a, c) => a + (c.matchPercent || 0), 0) / processedCandidates.length)
       : 0;

    return {
      total: candidates.length,
      highly: candidates.filter((c) => c.recommendation === 'Highly Recommended').length,
      avg: avgMatch,
      shortlisted: candidates.filter((c) => c.status === 'Shortlisted').length || 0,
    };
  }, [candidates]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Loader2 className="animate-spin text-navy-900 mb-2" size={32} />
        <p className="text-sm">Fetching real-time candidate data...</p>
      </div>
    );
  }

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
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Applicants" value={stats.total} hint="Real database count" icon={Users} />
        <StatCard label="Highly Recommended" value={stats.highly} hint="AI verified" icon={ThumbsUp} />
        <StatCard label="Average Match %" value={`${stats.avg}%`} hint="Processed pipeline" icon={Target} />
        <StatCard label="Shortlisted" value={stats.shortlisted} hint="Moved to next round" icon={Bookmark} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search candidate by name" className="input-field !pl-10" />
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
            {filtered.map((c, index) => {
              const cName = c.name || 'Extracting Name...';
              const cRec = c.recommendation || 'Pending';
              const cMatch = c.matchPercent || 0;
              const isPending = !c.recommendation || c.recommendation === 'Pending';

              return (
                <tr key={c.candidateId || c._id || index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-500">
                     {isPending ? '-' : `#${String(c.rank || index + 1).padStart(2, '0')}`}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{cName}</td>
                  <td className="px-6 py-4 text-slate-600">{c.appliedRole || job.title || 'Unknown Role'}</td>
                  <td className="px-6 py-4"><ProgressRing value={cMatch} /></td>
                  <td className="px-6 py-4"><StatusPill value={cRec} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/candidates/${c.candidateId || c._id}`} className="btn-secondary text-xs px-3 py-1.5 inline-block">View Profile</Link>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && !error && (
              <tr>
                 <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No candidates found for this role in the database.
                 </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FilterPanel open={showFilters} onClose={() => setShowFilters(false)} filters={filters} setFilters={setFilters} jobSkills={job.skills || []} />
      <ExportCsvModal open={showCsv} onClose={() => setShowCsv(false)} jobTitle={job.title} candidates={filtered} />
      <ExportPdfModal open={showPdf} onClose={() => setShowPdf(false)} jobTitle={job.title} candidates={filtered} />
    </div>
  );
}