import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Lock, Edit3, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsApi } from '../../api/jobs.api';
import mockJobs from '../../mocks/jobs.json';
import StatusPill from '../../components/ui/StatusPill';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await jobsApi.get(id);
        if (data) {
          setJob(data);
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        const fallback = mockJobs.find((j) => (j._id || j.id) === id) || mockJobs[0];
        setJob(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await jobsApi.remove(id);
      toast.success('Job deleted successfully');
      navigate('/jobs');
    } catch (err) {
      console.error('Failed to delete job:', err);
      toast.error(err.response?.data?.message || err.message || 'Error deleting job');
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = async () => {
    if (job?.status === 'Closed') {
      toast('Job is already closed', { icon: 'ℹ️' });
      return;
    }
    if (!window.confirm('Close this job posting to further applications?')) return;
    setClosing(true);
    try {
      await jobsApi.close(id);
      toast.success('Job closed successfully');
      setJob((prev) => ({ ...prev, status: 'Closed' }));
    } catch (err) {
      console.error('Failed to close job:', err);
      toast.error(err.response?.data?.message || err.message || 'Error closing job');
    } finally {
      setClosing(false);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="animate-spin text-navy-900 mb-2" size={32} />
        <p className="text-sm">Loading job specifications...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-lg font-bold text-slate-800">Job Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">This job posting might have been removed.</p>
        <Link to="/jobs" className="btn-primary mt-4 inline-block">Back to Job List</Link>
      </div>
    );
  }

  const jobId = job._id || job.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-sm text-slate-500">
              {job.department || 'N/A'} • {job.location || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-secondary flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete Job'}
          </button>
          <button
            onClick={handleClose}
            disabled={closing || job.status === 'Closed'}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <Lock size={16} /> {closing ? 'Closing...' : job.status === 'Closed' ? 'Closed' : 'Close Posting'}
          </button>
          <Link
            to={`/jobs/${jobId}/edit`}
            className="btn-primary flex items-center gap-2"
          >
            <Edit3 size={16} /> Edit Posting
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold mb-3">Job Description</h2>
          <p className="text-slate-600 whitespace-pre-line mb-6">
            {job.description || 'No description provided.'}
          </p>
          <h3 className="text-base font-semibold mb-3">Required Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills && job.skills.length > 0 ? (
              job.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No specific skills listed</span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="text-sm text-slate-500 mb-2">Applications Received</div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{job.applications ?? 0}</div>
              <Link to={`/reports/${jobId}`} className="btn-primary text-sm">
                View Candidates
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4">Job Specification</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Status">
                <StatusPill value={job.status} />
              </Row>
              <Row label="Employment Type">{job.employmentType || 'N/A'}</Row>
              <Row label="Experience Required">{job.experienceLevel || 'N/A'}</Row>
              <Row label="Salary Range">{job.salaryRange || 'Not disclosed'}</Row>
              <Row label="Posted Date">{formatDate(job.createdAt || job.postedDate)}</Row>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{children}</dd>
    </div>
  );
}
