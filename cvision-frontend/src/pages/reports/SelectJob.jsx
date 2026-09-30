import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import jobs from '../../mocks/jobs.json';
import StatusPill from '../../components/ui/StatusPill';

export default function SelectJob() {
  const [query, setQuery] = useState('');
  const recent = jobs.slice(0, 3);
  const filtered = jobs.filter((j) => !query || j.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Select Job Posting</h1>
          <p className="text-sm text-slate-500">Select an open vacancy below to generate AI-based candidate match and ranking metrics</p>
        </div>
        <div className="relative w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vacancy postings" className="input-field pl-10" />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase mb-3">Recently Viewed Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recent.map((j) => (
            <Link to={`/reports/${j._id}`} key={j._id} className="card p-5 hover:shadow-md transition border-2 border-transparent hover:border-brand-blue">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{j.department}</span>
                <span className="text-slate-400">Modified 2h ago</span>
              </div>
              <h3 className="font-semibold text-slate-900">{j.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{j.applications} Candidates</p>
              <div className="mt-4 text-brand-blue text-sm font-medium flex items-center gap-1">
                Open Report <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase mb-3">All Open Postings ({filtered.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((j) => (
            <div key={j._id} className="card p-5">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{j.department}</span>
                <StatusPill value={j.status} />
              </div>
              <h3 className="font-semibold text-slate-900">{j.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{j.applications} candidates ranked</p>
              <Link to={`/reports/${j._id}`} className="mt-4 inline-block btn-primary text-sm">Select</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
