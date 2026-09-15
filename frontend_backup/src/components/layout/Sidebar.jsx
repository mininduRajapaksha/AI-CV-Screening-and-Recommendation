import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  UploadCloud,
  Users,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import logo from "../../assets/Logo.png";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Jobs Postings", icon: Briefcase, to: "/jobs" },
  { label: "CV Upload", icon: UploadCloud, to: "/cv-upload" },
  { label: "Candidates", icon: Users, to: "/candidates" },
  { label: "Reports", icon: BarChart3, to: "/reports" },
];

export default function Sidebar({ onLogout }) {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
      isActive ? "text-white bg-[#172554]" : "text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col justify-between h-screen bg-white border-r border-slate-200 sticky top-0">
      <div>
        {/* Logo */}
        <div className="flex flex-col items-center py-6">
          <img src={logo} alt="CVision AI logo" className="w-18 h-18 object-contain" />
          <p className="mt-1 text-base font-semibold text-slate-800">
            CVision <span className="text-blue-600">AI</span>
          </p>
        </div>

        {/* Nav links */}
        <nav className="px-4 space-y-1.5 mt-2">
          {navLinks.map(({ label, icon: Icon, to }) => (
            <NavLink key={label} to={to} className={linkClasses}>
              <Icon size={19} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="px-4 pb-6 space-y-1.5">
        <div className="border-t border-slate-100 mb-3" />
        <NavLink to="/profile" className={linkClasses}>
          <User size={19} strokeWidth={1.75} />
          Profile
        </NavLink>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={19} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
}
