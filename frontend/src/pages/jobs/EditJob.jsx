import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Bold, Italic, Underline, List, Link as LinkIcon, X } from 'lucide-react'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useJobs } from '../../context/JobContext'

export default function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getJob, updateJob } = useJobs()
  const job = getJob(id)
  const [form, setForm] = useState(job || {})
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => { if (job) setForm(job) }, [job])

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      setForm({ ...form, skills: [...(form.skills || []), skillInput.trim()] })
      setSkillInput('')
    }
  }
  const removeSkill = (i) => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) })

  const handleUpdate = () => {
    updateJob(id, form)
    navigate(`/jobs/${id}`)
  }

  if (!job) return <MainLayout><p>Job not found</p></MainLayout>

  return (
    <MainLayout topbarTitle="Welcome Back, Minindu!">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Edit Job Posting</h2>
          <p className="text-sm text-gray-500 mt-1">Modify job specification details and candidate requirements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/jobs/${id}`)}>Cancel</Button>
          <Button variant="coral" onClick={handleUpdate}>Update Job</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Job Title" required value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Job Description <span className="text-coral">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-3 py-1.5 border-b border-gray-100 bg-gray-50">
                <Bold className="w-3.5 h-3.5 text-gray-500" /><Italic className="w-3.5 h-3.5 text-gray-500" />
                <Underline className="w-3.5 h-3.5 text-gray-500" /><List className="w-3.5 h-3.5 text-gray-500" />
                <LinkIcon className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <textarea rows="6" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 text-sm text-navy focus:outline-none resize-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Department <span className="text-coral">*</span></label>
              <select value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-navy">
                <option>Design</option><option>Engineering</option><option>Human Resources</option>
                <option>Quality Assurance</option><option>Infrastructure</option><option>Product</option>
              </select>
            </div>
            <Input label="Location" required value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Required Skills <span className="text-coral">*</span></label>
            <div className="border border-gray-200 rounded-lg p-2 min-h-[52px] flex flex-wrap gap-2 items-center">
              {(form.skills || []).map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-navy text-xs font-medium px-2.5 py-1 rounded-full">
                  {s} <button onClick={() => removeSkill(i)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}
                placeholder="Type a skill and press Enter..."
                className="flex-1 min-w-[150px] text-sm focus:outline-none py-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Employment Type <span className="text-coral">*</span></label>
              <select value={form.employmentType || 'Full-time'} onChange={e => setForm({ ...form, employmentType: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-navy">
                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Experience Level <span className="text-coral">*</span></label>
              <select value={form.experienceLevel || 'Mid-Senior Level'} onChange={e => setForm({ ...form, experienceLevel: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-navy">
                <option>Junior Level</option><option>Mid Level</option><option>Mid-Senior Level</option>
                <option>Senior Level</option><option>Director Level</option>
              </select>
            </div>
          </div>

          <Input label="Salary Range" required value={form.salary || ''} onChange={e => setForm({ ...form, salary: e.target.value })} />
        </div>
      </div>
    </MainLayout>
  )
}
