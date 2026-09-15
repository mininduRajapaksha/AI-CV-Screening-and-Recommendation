import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Check, FileEdit, Lock, Plus, Search, Trash2, Eye, Pencil } from 'lucide-react'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useJobs } from '../../context/JobContext'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-navy mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}

export default function JobList() {
  const { jobs, deleteJob } = useJobs()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()))
  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'Active').length,
    draft: jobs.filter(j => j.status === 'Draft').length,
    closed: jobs.filter(j => j.status === 'Closed').length
  }
  const statusVariant = { Active: 'success', Draft: 'warning', Closed: 'danger' }

  return (
    <MainLayout topbarTitle="Welcome Back, Minindu!">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Job Postings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and track your company's open career opportunities</p>
        </div>
        <Button variant="coral" onClick={() => navigate('/jobs/create')}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Create New Job</span>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Briefcase} label="Total Job Postings" value={stats.total} color="bg-blue-50 text-navy" />
        <StatCard icon={Check} label="Active Openings" value={stats.active} color="bg-green-50 text-green-600" />
        <StatCard icon={FileEdit} label="Draft Postings" value={stats.draft} color="bg-amber-50 text-amber-600" />
        <StatCard icon={Lock} label="Closed Jobs" value={stats.closed} color="bg-red-50 text-red-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by job title or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral/30" />
          </div>
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-navy"><option>All Departments</option></select>
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-navy"><option>All Statuses</option></select>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-5 py-3">Job Title</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Posted Date</th>
              <th className="px-5 py-3">Applications</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(job => (
              <tr key={job.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                <td className="px-5 py-4 font-semibold text-navy">{job.title}</td>
                <td className="px-5 py-4 text-gray-600">{job.department}</td>
                <td className="px-5 py-4 text-gray-600">{job.postedDate}</td>
                <td className="px-5 py-4 text-gray-600">{job.applications}</td>
                <td className="px-5 py-4"><Badge variant={statusVariant[job.status]}>{job.status}</Badge></td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => navigate(`/jobs/${job.id}/edit`)} className="p-1.5 text-gray-400 hover:text-navy"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => navigate(`/jobs/${job.id}`)} className="p-1.5 text-gray-400 hover:text-navy"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => deleteJob(job.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  )
}
