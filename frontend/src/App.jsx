import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import JobsPostings from "./pages/JobsPostings"
import CVUpload from "./pages/CVUpload"
import Candidates from "./pages/Candidates"
import Reports from "./pages/Reports"
import Profile from "./pages/Profile"


import AdminLayout from "./layouts/AdminLayout"
import UserManagement from "./pages/Admin/UserManagement"

function App() {

  return (
    <Router>
      <Routes>
        {/*Register/ Login Page */}

        {/*Main pages*/}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobsPostings />} />
          <Route path="cv-upload" element={<CVUpload />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/*Admin Pages*/}
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<UserManagement />} />
          {/* <Route path="/users" element={<UserManagement/>}/> */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
