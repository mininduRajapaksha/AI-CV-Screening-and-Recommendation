const express = require('express');
const router = express.Router();
const { getRankedCandidates, exportCSV, exportPDF } = require('../controllers/reportController');

// Add :jobId to filter candidates by the specific job
router.get('/:jobId/ranking', getRankedCandidates);
router.get('/:jobId/export/csv', exportCSV);
router.get('/:jobId/export/pdf', exportPDF);

module.exports = router;