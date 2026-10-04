import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import { JobProvider } from './context/JobContext'

import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import CVUpload from './pages/CVUpload'
import Candidates from './pages/Candidates'
import Profile from './pages/Profile'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import JobList from './pages/jobs/JobList'
import CreateJob from './pages/jobs/CreateJob'
import JobDetails from './pages/jobs/JobDetails'
import EditJob from './pages/jobs/EditJob'
import { Toaster } from 'react-hot-toast'
import SelectJob from './pages/reports/SelectJob'
import CandidateRanking from './pages/reports/CandidateRanking'
import CandidateDetail from './pages/CandidateDetail'

import AdminLayout from './layouts/AdminLayout'
import UserManagement from './pages/Admin/UserManagement'
import SystemStatus from './pages/Admin/SystemStatus'
import ApiConfiguration from './pages/Admin/ApiConfiguration'
import DatabaseStatus from './pages/Admin/DatabaseStatus'

function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()
  const token = localStorage.getItem('cvision_token') || localStorage.getItem('token')

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Toaster position="top-right" />
        <Router>
          <Routes>
            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
              {/* Main Pages */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<JobList />} />
                <Route path="jobs/create" element={<CreateJob />} />
                <Route path="jobs/:id" element={<JobDetails />} />
                <Route path="jobs/:id/edit" element={<EditJob />} />
                <Route path="cv-upload" element={<CVUpload />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="candidates/:candidateId" element={<CandidateDetail />} />
                <Route path="reports" element={<SelectJob />} />
                <Route path="reports/:id" element={<CandidateRanking />} />
                <Route path="reports/:jobId" element={<CandidateRanking />} />
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
            </Route>
          </Routes>
        </Router>
      </JobProvider>
    </AuthProvider>
  )
}
