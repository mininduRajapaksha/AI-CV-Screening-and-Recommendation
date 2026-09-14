import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Upload, Users, BarChart3, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs Postings', icon: Briefcase },
  { to: '/cv-upload', label: 'CV Upload', icon: Upload },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 }
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex flex-col items-center border-b border-gray-100">
        <img src={logo} alt="CVision AI" className="w-16 h-16 object-contain mb-2" />
        <span className="font-bold text-lg">
          <span className="text-navy">CVision</span>{' '}
          <span className="text-blue-500">AI</span>
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-navy text-white' : 'text-navy hover:bg-gray-100'}`
            }>
            <Icon className="w-4 h-4" />{label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 py-3 px-3 space-y-1">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-navy hover:bg-gray-100 w-full">
          <User className="w-4 h-4" /> Profile
        </button>
        <button onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-coral hover:bg-red-50 w-full">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  )
}
