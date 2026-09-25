import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#1E2A4A]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 rounded-l-3xl">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}