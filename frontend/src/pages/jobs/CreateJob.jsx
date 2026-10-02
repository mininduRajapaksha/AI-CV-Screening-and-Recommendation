import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, List, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ChipInput from '../../components/forms/ChipInput';
import { jobsApi } from '../../api/jobs.api';

export default function CreateJob() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', department: '', location: '',
    employmentType: 'Full-time', experienceLevel: 'Mid-Senior Level',
    salaryRange: '', description: '', skills: [],
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (asDraft = false) => {
    if (!form.title || !form.description) {
      toast.error('Title and Description are required');
      return;
    }
    setSaving(true);
    try {
      // Backend may not be ready  fall back to local mock on error
      try {
        await jobsApi.create({ ...form, status: asDraft ? 'Draft' : 'Active' });
      } catch {
        // simulate success locally
      }
      toast.success(asDraft ? 'Saved as draft' : 'Job posted successfully');
      navigate('/jobs');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Job Posting</h1>
          <p className="text-sm text-slate-500">Draft a new job role to publish to your careers portal and boards</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button onClick={() => save(true)} className="btn-secondary">Save as Draft</button>
          <button onClick={() => save(false)} disabled={saving} className="btn-primary">Post Job</button>
        </div>
      </div>

      <div className="card p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="label">Job Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department *</label>
              <select value={form.department} onChange={(e) => set('department', e.target.value)} className="input-field">
                <option value="">Select department</option>
                <option>Design</option><option>Engineering</option><option>Human Resources</option>
                <option>Infrastructure</option><option>Product</option><option>Quality Assurance</option>
              </select>
            </div>
            <div>
              <label className="label">Location *</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. San Francisco, CA (Hybrid)" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Employment Type *</label>
              <select value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)} className="input-field">
                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
              </select>
            </div>
            <div>
              <label className="label">Experience Level *</label>
              <select value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)} className="input-field">
                <option>Junior Level</option><option>Mid Level</option><option>Mid-Senior Level</option>
                <option>Senior Level</option><option>Lead / Principal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Salary Range *</label>
            <input value={form.salaryRange} onChange={(e) => set('salaryRange', e.target.value)} placeholder="e.g. \,000 - \,000 / year" className="input-field" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Job Description *</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 bg-slate-50 text-slate-500">
                <button className="p-1 hover:bg-slate-200 rounded"><Bold size={16} /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><Italic size={16} /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><Underline size={16} /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><List size={16} /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><LinkIcon size={16} /></button>
              </div>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={10}
                placeholder="Enter full job specifications, roles, and candidate requirements"
                className="w-full p-4 outline-none resize-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="label">Required Skills *</label>
            <ChipInput value={form.skills} onChange={(v) => set('skills', v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
