import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import Placeholder from '../pages/Placeholder';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

import JobList from '../pages/jobs/JobList';
import CreateJob from '../pages/jobs/CreateJob';
import EditJob from '../pages/jobs/EditJob';
import JobDetails from '../pages/jobs/JobDetails';

import SelectJob from '../pages/reports/SelectJob';
import CandidateRanking from '../pages/reports/CandidateRanking';
import CandidateDetail from '../pages/CandidateDetail';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/edit" element={<EditJob />} />
            <Route path="/cv-upload" element={<Placeholder title="CV Upload" />} />
            <Route path="/candidates/:candidateId" element={<CandidateDetail />} />`r`n            <Route path="/candidates" element={<Placeholder title="Candidates" />} />
            <Route path="/reports" element={<SelectJob />} />
            <Route path="/reports/:jobId" element={<CandidateRanking />} />
            <Route path="/profile" element={<Placeholder title="Profile" />} />
          </Route>

          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
