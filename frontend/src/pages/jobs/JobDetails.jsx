import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Trash2, Lock, Pencil } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useJobs } from '../../context/JobContext'

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getJob, deleteJob } = useJobs()
  const job = getJob(id)

  if (!job) return <Layout><p>Job not found</p></Layout>

  const handleDelete = () => {
    if (window.confirm('Delete this job posting?')) {
      deleteJob(job.id)
      navigate('/jobs')
    }
  }

  return (
    <Layout topbarTitle="Welcome Back, Minindu!">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-navy mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">{job.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{job.department} - {job.location}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleDelete}>
            <span className="flex items-center gap-1.5 text-red-500"><Trash2 className="w-4 h-4" /> Delete Job</span>
          </Button>
          <Button variant="secondary"><span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Close Posting</span></Button>
          <Button variant="navy" onClick={() => navigate(`/jobs/${job.id}/edit`)}>
            <span className="flex items-center gap-1.5"><Pencil className="w-4 h-4" /> Edit Posting</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-navy mb-3">Job Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>

          <h3 className="font-bold text-navy mt-6 mb-3">Required Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(s => (
              <span key={s} className="px-3 py-1.5 bg-gray-100 text-navy text-xs font-medium rounded-full">{s}</span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-xs text-gray-500 font-medium mb-2">Applications Received</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-navy">{job.applications}</span>
              <Button variant="coral" onClick={() => navigate(`/reports/${job.id}`)}>View Candidates</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-navy mb-4">Job Specification</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge variant={job.status === 'Active' ? 'success' : job.status === 'Draft' ? 'warning' : 'danger'}>{job.status}</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Employment Type</span><span className="font-semibold text-navy">{job.employmentType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Experience Required</span><span className="font-semibold text-navy">{job.experienceLevel}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Salary Range</span><span className="font-semibold text-navy">{job.salary}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Posted Date</span><span className="font-semibold text-navy">{job.postedDate}</span></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
