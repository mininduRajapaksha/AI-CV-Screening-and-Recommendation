const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Get Ranked Candidates
exports.getRankedCandidates = async (req, res) => {
  try {
    const mockRankedData = [
      { rank: '#01', name: 'Harshani', match: 98, rec: 'Highly Recommended', justification: 'Strong match with required skills.' },
      { rank: '#02', name: 'Kasun', match: 82, rec: 'Highly Recommended', justification: 'Good technical fit.' },
      { rank: '#03', name: 'Pabudi', match: 78, rec: 'Recommended', justification: 'Missing some minor skills.' },
      { rank: '#04', name: 'Diluni', match: 75, rec: 'Recommended', justification: 'Average match.' },
      { rank: '#05', name: 'Kaushi', match: 63, rec: 'Not Recommended', justification: 'Lacks required experience.' },
      { rank: '#06', name: 'Ravindu', match: 52, rec: 'Not Recommended', justification: 'Poor skill match.' },
    ];
    res.status(200).json(mockRankedData);
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
