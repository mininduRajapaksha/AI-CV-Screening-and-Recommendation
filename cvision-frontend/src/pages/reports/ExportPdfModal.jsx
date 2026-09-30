import { useState } from 'react';
import Modal from '../../components/ui/Modal';

export default function ExportPdfModal({ open, onClose, jobTitle }) {
  const [title, setTitle] = useState(`${jobTitle} - Evaluation Summary`);
  const [orientation, setOrientation] = useState('portrait');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);
  const [includeEmails, setIncludeEmails] = useState(false);

  const handleExport = () => {
    window.print();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate PDF Report"
      subtitle="Produce an executive candidate rank summary report."
      width="max-w-3xl"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleExport} className="btn-primary">Generate PDF</button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="label">Report Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
          </div>

          <div>
            <label className="label">Page Orientation</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              {['portrait', 'landscape'].map((o) => (
                <button
                  key={o}
                  onClick={() => setOrientation(o)}
                  className={`py-2 rounded-md text-sm font-medium capitalize ${orientation === o ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <Toggle label="Include analytics & matching charts" value={includeCharts} onChange={setIncludeCharts} />
          <Toggle label="Show company branding & logo" value={includeBranding} onChange={setIncludeBranding} />
          <Toggle label="Include full candidate contact emails" value={includeEmails} onChange={setIncludeEmails} />
        </div>

        <div>
          <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Preview</div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm aspect-[3/4]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-navy-900" />
              <div className="text-xs font-bold text-slate-800">CVision AI Report</div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-700">#{i} Candidate</span>
                <span className="text-emerald-600 font-semibold">{90 - i * 5}% Match</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-6 rounded-full transition relative ${value ? 'bg-navy-900' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${value ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
