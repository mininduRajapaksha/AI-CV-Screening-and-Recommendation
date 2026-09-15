import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ title = 'Welcome Back, Minindu!' }) {
  const { user } = useAuth()
  return (
    <header className="h-[72px] flex items-center justify-between px-8 border-b border-slate-200 bg-white sticky top-0 z-10">
      <h1 className="text-lg text-slate-800">{title}</h1>
      <div className="flex items-center gap-10">
        <button className="relative text-slate-600 cursor-pointer" aria-label="Notifications">
          <Bell size={25} strokeWidth={1.75} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#172554]" />
        </button>
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[#172554] text-white flex items-center justify-center text-xs font-semibold">
            {user?.initials || 'MR'}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'Minindu R.'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'HR Manager'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
