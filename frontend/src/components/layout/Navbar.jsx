import { Bell } from "lucide-react";

export default function Navbar({ user }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "?";

  return (
    <header className="h-[72px] flex items-center justify-between px-8 border-b border-slate-200 bg-white sticky top-0 z-10">
      <h1 className="text-lg text-slate-800">
        Welcome Back, <span className="font-semibold">{user?.firstName || "there"}!</span>
      </h1>

      <div className="flex items-center gap-10">
        <button className="relative text-slate-600 cursor-pointer" aria-label="Notifications">
          <Bell size={25} strokeWidth={1.75} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#172554]" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold bg-[#172554]">
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
