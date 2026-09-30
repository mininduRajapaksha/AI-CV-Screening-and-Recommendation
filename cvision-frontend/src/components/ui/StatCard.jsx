export default function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="card p-5 flex items-start justify-between">
      <div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
        <div className="text-3xl font-bold text-slate-900 mt-1">{value}</div>
        {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon size={20} className="text-slate-600" />
        </div>
      )}
    </div>
  );
}
