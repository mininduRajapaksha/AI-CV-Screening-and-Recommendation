import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import JobsPostings from "./pages/JobsPostings"
import CVUpload from "./pages/CVUpload"
import Candidates from "./pages/Candidates"
import Reports from "./pages/Reports"
import Profile from "./pages/Profile"


import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"

function App() {

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobsPostings />} />
          <Route path="cv-upload" element={<CVUpload />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
