import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CloudUpload,
  Users,
  ChartLine,
  User,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo.png'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs Postings', icon: BriefcaseBusiness },
  { to: '/cv-upload', label: 'CV Upload', icon: CloudUpload},
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/reports', label: 'Reports', icon: ChartLine }
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col justify-between h-screen bg-[#1E2A4A] sticky top-0">
      <div>
        {/* Logo */}
        <div className="flex flex-col items-center py-6">
          <img
            src={logo}
            alt="CVision AI logo"
            className="w-18 h-18 object-contain"
          />

          <p className="mt-1 text-base font-semibold text-white">
            CVision <span className="text-[#6D8EF5]">AI</span>
          </p>
        </div>
        <div className='border-t border-white/10 mx-4 mb-4'/>
          {/* Navigation */}
        <nav className="px-4 space-y-1.5 mt-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-[#2E3D68]'
                    : 'text-[#B8C4D8] hover:bg-white/[0.06] hover:text-white hover:translate-x-0.5'
                }`
              }
            >
              <Icon size={19} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 pb-6 space-y-1.5">
        <div className="border-t border-white/10 mb-3" />

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
              isActive
                ? 'text-white bg-[#2E3D68]'
                : 'text-[#B8C4D8] hover:bg-white/[0.06] hover:text-white'
            }`
          }
        >
          <User size={19} strokeWidth={1.75} />
          Profile
        </NavLink>

        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium text-red-400 hover:bg-red-500/10 w-full cursor-pointer transition-colors"
        >
          <LogOut size={19} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  )
}