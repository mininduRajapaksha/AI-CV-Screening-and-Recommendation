import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ title = 'Welcome Back, Minindu!' }) {
  const { user } = useAuth()
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="font-semibold text-navy">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full"><Bell className="w-5 h-5 text-navy" /></button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
            {user?.initials || 'MR'}
          </div>
          <div className="text-xs leading-tight">
            <div className="font-semibold text-navy">{user?.name || 'Minindu R.'}</div>
            <div className="text-gray-500">{user?.role || 'HR Manager'}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
