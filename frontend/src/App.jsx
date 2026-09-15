import { AuthProvider } from './context/AuthContext'
import { JobProvider } from './context/JobContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <AppRoutes />
      </JobProvider>
    </AuthProvider>
  )
}
