import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Upload, Users, BarChart3, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs Postings', icon: Briefcase },
  { to: '/cv-upload', label: 'CV Upload', icon: Upload },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-navy-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="px-6 py-6 flex flex-col items-center border-b border-white/10">
        <img src={logo} alt="CVision AI" className="w-16 h-16 mb-2" />
        <div className="text-lg font-semibold tracking-wide">
          CVision <span className="text-brand-cyan">AI</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <User size={20} /> Profile
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
