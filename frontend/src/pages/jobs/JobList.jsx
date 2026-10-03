import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit3,
  Eye,
  Trash2,
  Briefcase,
  CheckCircle2,
  FileEdit,
  Lock,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsApi } from '../../api/jobs.api';
import mockJobs from '../../mocks/jobs.json';
import StatCard from '../../components/ui/StatCard';
import StatusPill from '../../components/ui/StatusPill';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('');
  const [status, setStatus] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsApi.list();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs(mockJobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs from backend:', err);
      // Fallback to mock data if backend has no jobs or connection error
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      active: jobs.filter((j) => j.status === 'Active').length,
      draft: jobs.filter((j) => j.status === 'Draft').length,
      closed: jobs.filter((j) => j.status === 'Closed').length,
    }),
    [jobs]
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const titleMatch = !query || j.title?.toLowerCase().includes(query.toLowerCase());
      const deptMatch = !dept || j.department === dept;
      const statusMatch = !status || j.status === status;
      return titleMatch && deptMatch && statusMatch;
    });
  }, [jobs, query, dept, status]);

  const departments = useMemo(() => {
    return [...new Set(jobs.map((j) => j.department).filter(Boolean))];
  }, [jobs]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    try {
      await jobsApi.remove(id);
      toast.success('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => (j._id || j.id) !== id));
    } catch (err) {
      console.error('Failed to delete job:', err);
      toast.error(err.response?.data?.message || 'Error deleting job');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
          <p className="text-sm text-slate-500">
            Manage and track your company&apos;s open career opportunities
          </p>
        </div>
        <Link to="/jobs/create" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} /> Create New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Job Postings" value={stats.total} icon={Briefcase} />
        <StatCard label="Active Openings" value={stats.active} icon={CheckCircle2} />
        <StatCard label="Draft Postings" value={stats.draft} icon={FileEdit} />
        <StatCard label="Closed Jobs" value={stats.closed} icon={Lock} />
      </div>

      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title or keyword"
            className="input-field pl-10"
          />
        </div>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="input-field max-w-[180px]"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field max-w-[160px]"
        >
          <option value="">All Statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Closed</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="animate-spin text-navy-900 mb-2" size={32} />
            <p className="text-sm">Loading jobs from server...</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Job Title</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Posted Date</th>
                <th className="px-6 py-3">Applications</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => {
                const jobId = j._id || j.id;
                return (
                  <tr key={jobId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{j.title}</td>
                    <td className="px-6 py-4 text-slate-600">{j.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(j.createdAt || j.postedDate)}
                    </td>
                    <td className="px-6 py-4 font-semibold">{j.applications ?? 0}</td>
                    <td className="px-6 py-4">
                      <StatusPill value={j.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 text-slate-500">
                        <Link
                          to={`/jobs/${jobId}/edit`}
                          className="p-1.5 rounded hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <Link
                          to={`/jobs/${jobId}`}
                          className="p-1.5 rounded hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(jobId)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No jobs match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
