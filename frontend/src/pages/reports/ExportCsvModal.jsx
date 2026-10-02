import { useState } from 'react';
import Papa from 'papaparse';
import Modal from '../../components/ui/Modal';

const COLUMNS = [
  { id: 'rank', label: 'Rank', default: true },
  { id: 'appliedRole', label: 'Applied Role', default: true },
  { id: 'recommendation', label: 'Recommendation Level', default: true },
  { id: 'email', label: 'Email Contact', default: true },
  { id: 'name', label: 'Candidate Name', default: true },
  { id: 'matchPercent', label: 'AI Match %', default: true },
  { id: 'date', label: 'Date Applied', default: true },
];

export default function ExportCsvModal({ open, onClose, jobTitle }) {
  const [fileName, setFileName] = useState(
    `${jobTitle.toLowerCase().replace(/\s+/g, '_')}_ranking_${new Date().getFullYear()}.csv`
  );
  const [selected, setSelected] = useState(
    COLUMNS.reduce((a, c) => ({ ...a, [c.id]: c.default }), {})
  );

  const toggle = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const handleExport = () => {
    const rows = [
      { rank: 1, name: 'Harshani', appliedRole: jobTitle, matchPercent: 98, recommendation: 'Highly Recommended', email: 'h@example.com', date: '2026-09-28' },
    ];
    const columns = COLUMNS.filter((c) => selected[c.id]).map((c) => ({ key: c.id, label: c.label }));
    const csv = Papa.unparse({
      fields: columns.map((c) => c.label),
      data: rows.map((r) => columns.map((c) => r[c.key] ?? '')),
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Candidates (CSV)"
      subtitle="Export AI grading results to an excel-friendly spreadsheet format."
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleExport} className="btn-primary">Export CSV</button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <label className="label">File Name</label>
          <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="label mb-3">Columns to Include</label>
          <div className="grid grid-cols-2 gap-2">
            {COLUMNS.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!selected[c.id]} onChange={() => toggle(c.id)} className="rounded" />
                {c.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Format Preview</div>
          <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
            Rank, Name, Applied Role, AI Match, Status<br />
            #01, Harshani, Senior Product Designer, 98%, Highly Recommended<br />
            #02, Kasun, Senior Product Designer, 82%, Highly Recommended
          </div>
        </div>
      </div>
    </Modal>
  );
}
