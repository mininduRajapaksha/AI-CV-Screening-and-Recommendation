const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

// Get Ranked Candidates from Database
exports.getRankedCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Fetch candidates for the specific job and sort by matchPercent descending
    const candidates = await Candidate.find({ jobId: jobId }).sort({ matchPercent: -1 });

    // Map through candidates to format the data and assign a Rank
    const rankedData = candidates.map((c, index) => ({
      candidateId: c._id,
      rank: index + 1, // Dynamically assigning rank based on sorted array
      name: c.name,
      appliedRole: c.appliedRole || 'N/A',
      matchPercent: c.matchPercent,
      recommendation: c.recommendation,
      justification: c.justification || ''
    }));

    res.status(200).json(rankedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ranking data', error: error.message });
  }
};

// Export CSV API
exports.exportCSV = async (req, res) => {
  try {
    const data = [
      { Rank: '#01', Name: 'Harshani', Match: '98%', Recommendation: 'Highly Recommended' },
      { Rank: '#02', Name: 'Kasun', Match: '82%', Recommendation: 'Highly Recommended' },
    ];
    const fields = ['Rank', 'Name', 'Match', 'Recommendation'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('candidate_ranking.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting CSV', error: error.message });
  }
};

// Export PDF API
exports.exportPDF = async (req, res) => {
  try {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=candidate_report.pdf');
    
    doc.pipe(res);
    doc.fontSize(20).text('AI Candidate Ranking Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Rank #01: Harshani - 98% (Highly Recommended)');
    doc.text('Rank #02: Kasun - 82% (Highly Recommended)');
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error exporting PDF', error: error.message });
  }
};