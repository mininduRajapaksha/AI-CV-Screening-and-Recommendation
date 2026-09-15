import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { JobProvider } from './context/JobContext'

import MainLayout from './layouts/MainLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import JobList from './pages/jobs/JobList'
import CreateJob from './pages/jobs/CreateJob'
import JobDetails from './pages/jobs/JobDetails'
import EditJob from './pages/jobs/EditJob'
import SelectJob from './pages/reports/SelectJob'
import CandidateRanking from './pages/reports/CandidateRanking'

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <Routes>
            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Main Pages */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="jobs" element={<JobList />} />
              <Route path="jobs/create" element={<CreateJob />} />
              <Route path="jobs/:id" element={<JobDetails />} />
              <Route path="jobs/:id/edit" element={<EditJob />} />
              <Route path="reports" element={<SelectJob />} />
              <Route path="reports/:id" element={<CandidateRanking />} />
            </Route>
          </Routes>
        </Router>
      </JobProvider>
    </AuthProvider>
  )
}
