import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bold, Italic, Underline, List, Link as LinkIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ChipInput from '../../components/forms/ChipInput';
import { jobsApi } from '../../api/jobs.api';
import mockJobs from '../../mocks/jobs.json';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Senior Level',
    salaryRange: '',
    description: '',
    skills: [],
    status: 'Active',
  });

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await jobsApi.get(id);
        if (data) {
          setForm({
            title: data.title || '',
            department: data.department || '',
            location: data.location || '',
            employmentType: data.employmentType || 'Full-time',
            experienceLevel: data.experienceLevel || 'Mid-Senior Level',
            salaryRange: data.salaryRange || '',
            description: data.description || '',
            skills: data.skills || [],
            status: data.status || 'Active',
          });
        }
      } catch (err) {
        console.error('Failed to fetch job for edit:', err);
        const fallback = mockJobs.find((j) => (j._id || j.id) === id) || mockJobs[0];
        if (fallback) {
          setForm({ ...fallback });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and Description are required');
      return;
    }
    setSaving(true);
    try {
      await jobsApi.update(id, form);
      toast.success('Job updated successfully');
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error('Failed to update job:', err);
      toast.error(
        err.response?.data?.message || err.message || 'Failed to update job'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="animate-spin text-navy-900 mb-2" size={32} />
        <p className="text-sm">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Job Posting</h1>
          <p className="text-sm text-slate-500">
            Modify job specification details and candidate requirements
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            disabled={saving}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Updating...
              </span>
            ) : (
              'Update Job'
            )}
          </button>
        </div>
      </div>

      <div className="card p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="label">Job Title *</label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department *</label>
              <input
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Location *</label>
              <input
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Employment Type *</label>
              <select
                value={form.employmentType}
                onChange={(e) => set('employmentType', e.target.value)}
                className="input-field"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="label">Experience Level *</label>
              <select
                value={form.experienceLevel}
                onChange={(e) => set('experienceLevel', e.target.value)}
                className="input-field"
              >
                <option>Junior Level</option>
                <option>Mid Level</option>
                <option>Mid-Senior Level</option>
                <option>Senior Level</option>
                <option>Lead / Principal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="input-field"
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>

          <div>
            <label className="label">Salary Range</label>
            <input
              value={form.salaryRange}
              onChange={(e) => set('salaryRange', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Job Description *</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 bg-slate-50 text-slate-500">
                <button type="button" className="p-1 hover:bg-slate-200 rounded">
                  <Bold size={16} />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded">
                  <Italic size={16} />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded">
                  <Underline size={16} />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded">
                  <List size={16} />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded">
                  <LinkIcon size={16} />
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={10}
                className="w-full p-4 outline-none resize-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="label">Required Skills *</label>
            <ChipInput value={form.skills || []} onChange={(v) => set('skills', v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
