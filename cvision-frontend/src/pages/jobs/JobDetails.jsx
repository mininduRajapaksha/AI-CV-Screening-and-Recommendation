import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Lock, Edit3 } from 'lucide-react';
import jobs from '../../mocks/jobs.json';
import StatusPill from '../../components/ui/StatusPill';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((j) => j._id === id) || jobs[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-sm text-slate-500">{job.department}  {job.location}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50"><Trash2 size={16} /> Delete Job</button>
          <button className="btn-secondary flex items-center gap-2"><Lock size={16} /> Close Posting</button>
          <Link to={`/jobs/${job._id}/edit`} className="btn-primary flex items-center gap-2"><Edit3 size={16} /> Edit Posting</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold mb-3">Job Description</h2>
          <p className="text-slate-600 whitespace-pre-line mb-6">{job.description}</p>
          <h3 className="text-base font-semibold mb-3">Required Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((s) => (
              <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{s}</span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="text-sm text-slate-500 mb-2">Applications Received</div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{job.applications}</div>
              <Link to={`/reports/${job._id}`} className="btn-primary text-sm">View Candidates</Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4">Job Specification</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Status"><StatusPill value={job.status} /></Row>
              <Row label="Employment Type">{job.employmentType}</Row>
              <Row label="Experience Required">{job.experienceLevel}</Row>
              <Row label="Salary Range">{job.salaryRange}</Row>
              <Row label="Posted Date">{new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Row>
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
