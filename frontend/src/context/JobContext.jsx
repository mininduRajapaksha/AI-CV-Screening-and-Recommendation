import { createContext, useContext, useState } from 'react'
import { initialJobs, candidatesByJob } from '../data/mockData'

const JobContext = createContext(null)

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState(initialJobs)

  const addJob = (job) => {
    const newJob = { ...job, id: Date.now(), applications: 0, status: 'Draft', postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
    setJobs(prev => [newJob, ...prev])
    return newJob
  }
  const updateJob = (id, updates) => setJobs(prev => prev.map(j => String(j.id) === String(id) ? { ...j, ...updates } : j))
  const deleteJob = (id) => setJobs(prev => prev.filter(j => String(j.id) !== String(id)))
  const getJob = (id) => jobs.find(j => String(j.id) === String(id))
  const getCandidates = () => candidatesByJob.default

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, getJob, getCandidates }}>
      {children}
    </JobContext.Provider>
  )
}

export const useJobs = () => useContext(JobContext)
