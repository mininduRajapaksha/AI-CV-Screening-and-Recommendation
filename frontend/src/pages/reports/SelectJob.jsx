import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { jobsApi } from '../../api/jobs.api';
import StatusPill from '../../components/ui/StatusPill';

export default function SelectJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await jobsApi.list();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load jobs for reports:', err);
        setError('Unable to load job postings from the server. Check your connection and try again.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const recent = jobs.slice(0, 3);
  const filtered = jobs.filter(
    (j) => !query || j.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Select Job Posting</h1>
          <p className="text-sm text-slate-500">
            Select an open vacancy below to generate AI-based candidate match and
            ranking metrics
          </p>
        </div>
        <div className="relative w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vacancy postings"
            className="input-field !pl-10" 
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="animate-spin text-navy-900 mb-2" size={32} />
          <p className="text-sm">Loading available job roles...</p>
        </div>
      ) : (
        <>
          {error && <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase mb-3">
              Recently Viewed Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recent.map((j) => {
                const jobId = j._id || j.id;
                return (
                  <Link
                    to={`/reports/${jobId}`}
                    key={jobId}
                    className="card p-5 hover:shadow-md transition border-2 border-transparent hover:border-brand-blue"
                  >
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {j.department || 'General'}
                      </span>
                      <span className="text-slate-400">Open Report</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{j.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {j.applications ?? 0} Candidates
                    </p>
                    <div className="mt-4 text-brand-blue text-sm font-medium flex items-center gap-1">
                      Open Report <ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
              {recent.length === 0 && <p className="col-span-full text-sm text-slate-500">No job postings are available yet.</p>}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase mb-3">
              All Open Postings ({filtered.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filtered.map((j) => {
                const jobId = j._id || j.id;
                return (
                  <div key={jobId} className="card p-5">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {j.department || 'General'}
                      </span>
                      <StatusPill value={j.status} />
                    </div>
                    <h3 className="font-semibold text-slate-900">{j.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {j.applications ?? 0} candidates ranked
                    </p>
                    <Link
                      to={`/reports/${jobId}`}
                      className="mt-4 inline-block btn-primary text-sm"
                    >
                      Select
                    </Link>
                  </div>
                );
              })}
              {filtered.length === 0 && query && <p className="col-span-full text-sm text-slate-500">No postings match your search.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
