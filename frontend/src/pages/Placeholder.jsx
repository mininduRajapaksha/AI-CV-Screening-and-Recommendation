export default function Placeholder({ title }) {
  return (
    <div className="card p-12 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="text-slate-500 mt-2">This screen is owned by another teammate.</p>
    </div>
  );
}
