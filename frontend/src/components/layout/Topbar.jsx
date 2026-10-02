import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'MR';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-20">
      <div className="font-medium text-slate-800">
        Welcome Back, {user?.fullName?.split(' ')[0] || 'Minindu'}!
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-slate-100 transition">
          <Bell size={20} className="text-slate-600" />
        </button>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-800">{user?.fullName || 'Minindu R.'}</div>
          <div className="text-xs text-slate-500">{user?.role || 'HR Manager'}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
