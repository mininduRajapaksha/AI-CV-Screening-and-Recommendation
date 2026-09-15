import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Upload, Users, BarChart3, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo.png'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs Postings', icon: Briefcase },
  { to: '/cv-upload', label: 'CV Upload', icon: Upload },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 }
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col justify-between h-screen bg-white border-r border-slate-200 sticky top-0">
      <div>
        <div className="flex flex-col items-center py-6">
          <img src={logo} alt="CVision AI logo" className="w-18 h-18 object-contain" />
          <p className="mt-1 text-base font-semibold text-slate-800">
            CVision <span className="text-blue-600">AI</span>
          </p>
        </div>

        <nav className="px-4 space-y-1.5 mt-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${isActive ? 'text-white bg-[#172554]' : 'text-slate-600 hover:bg-slate-50'}`
              }>
              <Icon size={19} strokeWidth={1.75} />{label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-4 pb-6 space-y-1.5">
        <div className="border-t border-slate-100 mb-3" />
        <NavLink to="/profile" className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${isActive ? 'text-white bg-[#172554]' : 'text-slate-600 hover:bg-slate-50'}`
        }>
          <User size={19} strokeWidth={1.75} /> Profile
        </NavLink>
        <button onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium text-red-500 hover:bg-red-50 w-full cursor-pointer">
          <LogOut size={19} strokeWidth={1.75} /> Logout
        </button>
      </div>
    </aside>
  )
}
