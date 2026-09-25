import { NavLink } from "react-router-dom";
import {
  Users,
  KeyRound,
  Server,
  Database,
  User,
  LogOut,
} from "lucide-react";
import logo from "../../assets/Logo.png";

const navLinks = [
  { label: "User Management", icon: Users, to: "/admin" },
  { label: "API Configuration", icon: KeyRound, to: "/admin/api-configuration" },
  { label: "System Status", icon: Server, to: "/admin/system-status" },
  { label: "Database Status", icon: Database, to: "/admin/database-status" },
];

export default function AdminSidebar({ onLogout }) {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
      isActive
        ? "text-white bg-[#2E3D68]"
        : "text-[#B8C4D8] hover:bg-white/[0.06] hover:text-white"
    }`;

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

        {/* Nav links */}
        <nav className="px-4 space-y-1.5 mt-2">
          {navLinks.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/admin"}
              className={linkClasses}
            >
              <Icon size={19} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="px-4 pb-6 space-y-1.5">
        <div className="border-t border-white/10 mb-3" />

        <NavLink to="/admin/profile" className={linkClasses}>
          <User size={19} strokeWidth={1.75} />
          Profile
        </NavLink>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
        >
          <LogOut size={19} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
}