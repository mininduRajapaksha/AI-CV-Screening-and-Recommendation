import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import MainLayout from '../../layouts/MainLayout'
import Badge from '../../components/ui/Badge'
import { useJobs } from '../../context/JobContext'

function JobCard({ job, onClick, recently }) {
  const statusVariant = { Active: 'success', Draft: 'warning', Closed: 'danger' }
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-coral">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">{job.department}</span>
        {recently ? <span className="text-xs text-gray-400">Modified 2h ago</span> : <Badge variant={statusVariant[job.status]}>{job.status}</Badge>}
      </div>
      <h3 className="font-bold text-navy mb-2">{job.title}</h3>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{job.applications} candidates ranked</span>
        {recently ? <span className="text-coral font-semibold">Open Report -&gt;</span> : <span className="bg-navy text-white px-2 py-1 rounded font-semibold">Select</span>}
      </div>
    </div>
  )
}

export default function SelectJob() {
  const navigate = useNavigate()
  const { jobs } = useJobs()
  const [search, setSearch] = useState('')

  const filtered = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()))
  const recent = filtered.slice(0, 3)

  return (
    <MainLayout topbarTitle="Evaluation Reports Dashboard">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Select Job Posting</h2>
          <p className="text-sm text-gray-500 mt-1">Select an open vacancy below to generate AI-backed candidate match and ranking matrices</p>
        </div>
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vacancy postings..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral/30" />
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Recently Viewed Reports</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {recent.map(j => <JobCard key={j.id} job={j} onClick={() => navigate(`/reports/${j.id}`)} recently />)}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">All Open Postings ({jobs.length})</p>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(j => <JobCard key={j.id} job={j} onClick={() => navigate(`/reports/${j.id}`)} />)}
      </div>
    </MainLayout>
  )
}
