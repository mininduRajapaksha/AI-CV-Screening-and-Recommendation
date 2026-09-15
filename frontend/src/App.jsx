import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { JobProvider } from './context/JobContext'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import Dashboard from './pages/Dashboard'
import JobList from './pages/jobs/JobList'
import CreateJob from './pages/jobs/CreateJob'
import JobDetails from './pages/jobs/JobDetails'
import EditJob from './pages/jobs/EditJob'
import CVUpload from './pages/CVUpload'
import Candidates from './pages/Candidates'
import SelectJob from './pages/reports/SelectJob'
import CandidateRanking from './pages/reports/CandidateRanking'
import Profile from './pages/Profile'

import UserManagement from './pages/Admin/UserManagement'
import SystemStatus from './pages/Admin/SystemStatus'
import ApiConfiguration from './pages/Admin/ApiConfiguration'
import DatabaseStatus from './pages/Admin/DatabaseStatus'

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
              <Route path="cv-upload" element={<CVUpload />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="reports" element={<SelectJob />} />
              <Route path="reports/:id" element={<CandidateRanking />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin Pages */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<UserManagement />} />
              <Route path="system-status" element={<SystemStatus />} />
              <Route path="api-configuration" element={<ApiConfiguration />} />
              <Route path="database-status" element={<DatabaseStatus />} />
              <Route path="profile" element={<Profile accountType="admin" />} />
            </Route>
          </Routes>
        </Router>
      </JobProvider>
    </AuthProvider>
  )
}
