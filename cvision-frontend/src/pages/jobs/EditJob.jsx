import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bold, Italic, Underline, List, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ChipInput from '../../components/forms/ChipInput';
import jobs from '../../mocks/jobs.json';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = jobs.find((j) => j._id === id) || jobs[0];
  const [form, setForm] = useState({ ...existing });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    toast.success('Job updated successfully');
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Job Posting</h1>
          <p className="text-sm text-slate-500">Modify job specification details and candidate requirements</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Update Job</button>
        </div>
      </div>

      <div className="card p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="label">Job Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department *</label>
              <input value={form.department} onChange={(e) => set('department', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Location *</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Employment Type *</label>
              <input value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Experience Level *</label>
              <input value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Salary Range *</label>
            <input value={form.salaryRange} onChange={(e) => set('salaryRange', e.target.value)} className="input-field" />
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
