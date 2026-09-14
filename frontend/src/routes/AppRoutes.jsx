import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import JobList from '../pages/jobs/JobList'
import CreateJob from '../pages/jobs/CreateJob'
import JobDetails from '../pages/jobs/JobDetails'
import EditJob from '../pages/jobs/EditJob'
import SelectJob from '../pages/reports/SelectJob'
import CandidateRanking from '../pages/reports/CandidateRanking'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
      <Route path="/jobs/create" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
      <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
      <Route path="/jobs/:id/edit" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />

      <Route path="/reports" element={<ProtectedRoute><SelectJob /></ProtectedRoute>} />
      <Route path="/reports/:id" element={<ProtectedRoute><CandidateRanking /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
