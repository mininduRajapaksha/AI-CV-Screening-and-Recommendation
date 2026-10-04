import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { reportsApi } from '../../api/reports.api';

const COLUMNS = [
  { id: 'rank', label: 'Rank' },
  { id: 'appliedRole', label: 'Applied Role' },
  { id: 'recommendation', label: 'Recommendation Level' },
  { id: 'email', label: 'Email Contact' },
  { id: 'name', label: 'Candidate Name' },
  { id: 'matchPercent', label: 'AI Match %' },
  { id: 'date', label: 'Date Applied' },
];

export default function ExportCsvModal({ open, onClose, jobId, jobTitle, candidates = [] }) {
  const [fileName, setFileName] = useState(
    `${jobTitle?.toLowerCase().replace(/\s+/g, '_') || 'job'}_ranking_${new Date().getFullYear()}.csv`
  );
  const [selected, setSelected] = useState(() =>
    COLUMNS.reduce((values, column) => ({ ...values, [column.id]: true }), {})
  );
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const toggle = (id) => setSelected((current) => ({ ...current, [id]: !current[id] }));

  const handleExport = async () => {
    const fields = COLUMNS.filter((column) => selected[column.id]).map((column) => column.id);
    if (!fields.length) {
      setError('Select at least one column to export.');
      return;
    }
    try {
      setExporting(true);
      setError('');
      const response = await reportsApi.exportCsv(jobId, {
        candidateIds: candidates.map((candidate) => candidate.candidateId),
        fields,
        fileName,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.replace(/\.csv$/i, '') || 'candidate_ranking'}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (exportError) {
      setError(exportError.response?.data?.message || 'Could not export the report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Candidates (CSV)"
      subtitle="Export the selected candidate results from the server."
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleExport} disabled={exporting} className="btn-primary disabled:opacity-50">
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="label" htmlFor="report-csv-file-name">File Name</label>
          <input id="report-csv-file-name" value={fileName} onChange={(event) => setFileName(event.target.value)} className="input-field" />
        </div>
        <div>
          <span className="label mb-3">Columns to Include</span>
          <div className="grid grid-cols-2 gap-2">
            {COLUMNS.map((column) => (
              <label key={column.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!selected[column.id]} onChange={() => toggle(column.id)} className="rounded" />
                {column.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Format Preview</div>
          <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
            Rank, Name, Applied Role, AI Match, Recommendation<br />
            {candidates.slice(0, 2).map((candidate, index) => (
              <span key={candidate.candidateId || index}>
                #{String(candidate.rank).padStart(2, '0')}, {candidate.name}, {candidate.appliedRole || jobTitle}, {candidate.matchPercent}%, {candidate.recommendation}<br />
              </span>
            ))}
            {candidates.length === 0 && <span>No candidates available for preview.</span>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
