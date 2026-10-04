import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { reportsApi } from '../../api/reports.api';

export default function ExportPdfModal({ open, onClose, jobId, jobTitle, candidates = [] }) {
  const [title, setTitle] = useState(`${jobTitle} - Evaluation Summary`);
  const [orientation, setOrientation] = useState('portrait');
  const [includeEmails, setIncludeEmails] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    try {
      setExporting(true);
      setError('');
      const response = await reportsApi.exportPdf(jobId, {
        title,
        orientation,
        includeEmails,
        candidateIds: candidates.map((candidate) => candidate.candidateId),
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'candidate_report.pdf';
      link.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (exportError) {
      setError(exportError.response?.data?.message || 'Could not generate the report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate PDF Report"
      subtitle="Generate a ranking summary from the current candidate results."
      width="max-w-3xl"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleExport} disabled={exporting} className="btn-primary disabled:opacity-50">
            {exporting ? 'Generating…' : 'Generate PDF'}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="label" htmlFor="report-pdf-title">Report Title</label>
            <input id="report-pdf-title" value={title} onChange={(event) => setTitle(event.target.value)} className="input-field" />
          </div>
          <div>
            <span className="label">Page Orientation</span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              {['portrait', 'landscape'].map((option) => (
                <button key={option} onClick={() => setOrientation(option)} className={`py-2 rounded-md text-sm font-medium capitalize ${orientation === option ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={includeEmails} onChange={(event) => setIncludeEmails(event.target.checked)} />
            Include candidate email addresses
          </label>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Preview</div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm min-h-48">
            <div className="text-sm font-bold text-slate-800">{title}</div>
            <div className="mt-1 text-xs text-slate-500">{jobTitle} · {candidates.length} candidates</div>
            <div className="mt-4 space-y-2">
              {candidates.slice(0, 4).map((candidate, index) => (
                <div key={candidate.candidateId || index} className="flex items-center justify-between border-b border-slate-100 py-2 text-xs">
                  <span className="text-slate-700">#{candidate.rank} {candidate.name}</span>
                  <span className="text-emerald-600 font-semibold">{candidate.matchPercent}% · {candidate.recommendation}</span>
                </div>
              ))}
              {candidates.length === 0 && <div className="text-xs text-slate-400">No candidates match the current filters.</div>}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
