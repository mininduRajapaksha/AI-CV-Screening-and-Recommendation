import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { X } from 'lucide-react';

export default function FilterPanel({ open, onClose, filters, setFilters, jobSkills }) {
  if (!open) return null;

  const toggleRec = (val) => {
    const has = filters.recommendation.includes(val);
    const next = has ? filters.recommendation.filter((r) => r !== val) : [...filters.recommendation, val];
    setFilters({ ...filters, recommendation: next });
  };

  const toggleSkill = (s) => {
    const has = filters.skills.includes(s);
    setFilters({ ...filters, skills: has ? filters.skills.filter((x) => x !== s) : [...filters.skills, s] });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-96 bg-white h-full shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 mb-3">Recommendation Level</div>
            {['Highly Recommended', 'Recommended', 'Not Recommended'].map((r) => (
              <label key={r} className="flex items-center gap-2 py-1.5 text-sm">
                <input type="checkbox" checked={filters.recommendation.includes(r)} onChange={() => toggleRec(r)} className="rounded" />
                {r}
              </label>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500 mb-3">
              <span>AI Match Range</span>
              <span className="text-slate-900">{filters.range[0]}%  {filters.range[1]}%</span>
            </div>
            <Slider range min={0} max={100} value={filters.range} onChange={(v) => setFilters({ ...filters, range: v })} />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 mb-3">Experience Level</div>
            <select value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })} className="input-field">
              <option value="">Any</option>
              <option>Junior (02 Years)</option>
              <option>Mid (25 Years)</option>
              <option>Senior (58 Years)</option>
              <option>Lead (8+ Years)</option>
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase text-slate-500 mb-3">Must-Have Skills</div>
            <div className="flex flex-wrap gap-2">
              {jobSkills.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`px-3 py-1 rounded-full text-sm border ${filters.skills.includes(s) ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full mt-8">Apply Filters</button>
      </div>
    </div>
  );
}
