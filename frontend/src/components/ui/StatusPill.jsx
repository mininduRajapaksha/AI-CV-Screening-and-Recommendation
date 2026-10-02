import clsx from 'clsx';

const styles = {
  // Job statuses
  Active:   'bg-emerald-100 text-emerald-700',
  Draft:    'bg-slate-200 text-slate-700',
  Closed:   'bg-red-100 text-red-700',
  // Recommendations
  'Highly Recommended': 'bg-emerald-100 text-emerald-700',
  Recommended:          'bg-amber-100 text-amber-700',
  'Not Recommended':    'bg-red-100 text-red-700',
};

export default function StatusPill({ value }) {
  return (
    <span className={clsx('inline-block px-3 py-1 rounded-full text-xs font-semibold', styles[value] || 'bg-slate-100 text-slate-700')}>
      {value}
    </span>
  );
}
