const express = require('express');
const router = express.Router();
const { getRankedCandidates, exportCSV, exportPDF } = require('../controllers/reportController');

// Routes for Reports
router.get('/ranking', getRankedCandidates);
router.get('/export/csv', exportCSV);
router.get('/export/pdf', exportPDF);

module.exports = router;
