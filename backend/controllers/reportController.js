const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

const REPORT_FIELDS = {
  rank: 'Rank',
  name: 'Candidate Name',
  appliedRole: 'Applied Role',
  matchPercent: 'AI Match %',
  recommendation: 'Recommendation',
  email: 'Email Contact',
  date: 'Date Applied',
};

async function getReportData(jobId) {
  const job = await Job.findById(jobId).lean();
  if (!job) return null;

  const candidates = await Candidate.find({ jobId: String(jobId) })
    .sort({ matchPercentage: -1, createdAt: 1, _id: 1 })
    .lean();

  return {
    job,
    candidates: candidates.map((candidate, index) => ({
      candidateId: candidate._id,
      rank: index + 1,
      name: candidate.personalInfo?.name || 'Unknown Candidate',
      email: candidate.personalInfo?.email || '',
      appliedRole: job.title,
      matchPercent: Number(candidate.matchPercentage) || 0,
      recommendation: candidate.aiRecommendation || 'Pending',
      justification: candidate.justification || '',
      status: candidate.status || 'Pending',
      date: candidate.createdAt ? new Date(candidate.createdAt).toISOString().slice(0, 10) : '',
    })),
  };
}

function selectRequestedCandidates(allCandidates, candidateIds) {
  if (!Array.isArray(candidateIds)) return allCandidates;
  const requested = new Set(candidateIds.map(String));
  return allCandidates.filter((candidate) => requested.has(String(candidate.candidateId)));
}

exports.getRankedCandidates = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.jobId)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    const report = await getReportData(req.params.jobId);
    if (!report) return res.status(404).json({ message: 'Job not found' });
    return res.status(200).json({ success: true, data: report.candidates });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching ranking data', error: error.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.jobId)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    const report = await getReportData(req.params.jobId);
    if (!report) return res.status(404).json({ message: 'Job not found' });

    const candidates = selectRequestedCandidates(report.candidates, req.body?.candidateIds);
    const requestedFields = Array.isArray(req.body?.fields) ? req.body.fields : Object.keys(REPORT_FIELDS);
    const fields = requestedFields.filter((field) => Object.hasOwn(REPORT_FIELDS, field));
    if (!fields.length) return res.status(400).json({ message: 'Select at least one valid export field' });

    const parser = new Parser({ fields: fields.map((field) => ({ label: REPORT_FIELDS[field], value: field })) });
    const csv = parser.parse(candidates);
    const filename = String(req.body?.fileName || 'candidate_ranking.csv')
      .replace(/[\\/:*?"<>|\r\n]/g, '_').replace(/\.csv$/i, '') + '.csv';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csv);
  } catch (error) {
    return res.status(500).json({ message: 'Error exporting CSV', error: error.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.jobId)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    const report = await getReportData(req.params.jobId);
    if (!report) return res.status(404).json({ message: 'Job not found' });
    const candidates = selectRequestedCandidates(report.candidates, req.body?.candidateIds);
    const includeEmails = req.body?.includeEmails === true;
    const orientation = req.body?.orientation === 'landscape' ? 'landscape' : 'portrait';
    const title = String(req.body?.title || `${report.job.title} - Evaluation Summary`).slice(0, 120);
    const average = candidates.length
      ? Math.round(candidates.reduce((total, candidate) => total + candidate.matchPercent, 0) / candidates.length)
      : 0;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="candidate_report.pdf"');
    const doc = new PDFDocument({ size: 'A4', layout: orientation, margin: 42 });
    doc.pipe(res);
    doc.fontSize(19).fillColor('#172554').text(title, { align: 'center' });
    doc.moveDown(0.5).fontSize(10).fillColor('#475569')
      .text(`Role: ${report.job.title}   |   Candidates: ${candidates.length}   |   Average match: ${average}%`, { align: 'center' });
    doc.moveDown();

    const columns = [
      { label: 'Rank', width: 42, value: (candidate) => `#${String(candidate.rank).padStart(2, '0')}` },
      { label: 'Candidate', width: orientation === 'landscape' ? 155 : 115, value: (candidate) => candidate.name },
      ...(includeEmails ? [{ label: 'Email', width: orientation === 'landscape' ? 150 : 100, value: (candidate) => candidate.email || '—' }] : []),
      { label: 'Match', width: 55, value: (candidate) => `${candidate.matchPercent}%` },
      { label: 'Recommendation', width: 120, value: (candidate) => candidate.recommendation },
    ];
    const tableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const totalColumnWidth = columns.reduce((sum, column) => sum + column.width, 0);
    const scale = Math.min(1, tableWidth / totalColumnWidth);
    const widths = columns.map((column) => column.width * scale);
    const drawHeader = () => {
      const headerY = doc.y;
      let x = doc.page.margins.left;
      columns.forEach((column, index) => {
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#172554')
          .text(column.label, x, headerY, { width: widths[index], height: 12, lineBreak: false });
        x += widths[index];
      });
      doc.y = headerY + 14;
      doc.moveDown(0.5).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#cbd5e1').stroke();
      doc.moveDown(0.5);
    };
    drawHeader();
    for (const candidate of candidates) {
      const rowTop = doc.y;
      const height = Math.max(20, ...columns.map((column, index) => doc.heightOfString(String(column.value(candidate) || '—'), { width: widths[index] - 6, fontSize: 8 })));
      if (rowTop + height > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        drawHeader();
      }
      const currentRowY = doc.y;
      let x = doc.page.margins.left;
      columns.forEach((column, index) => {
        doc.font('Helvetica').fontSize(8).fillColor('#334155')
          .text(String(column.value(candidate) || '—'), x, currentRowY, { width: widths[index] - 6, height: Math.max(20, height), ellipsis: true });
        x += widths[index];
      });
      doc.y = currentRowY + Math.max(20, height) + 7;
      doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#e2e8f0').stroke();
      doc.moveDown(0.5);
    }
    doc.end();
  } catch (error) {
    return res.status(500).json({ message: 'Error exporting PDF', error: error.message });
  }
};
