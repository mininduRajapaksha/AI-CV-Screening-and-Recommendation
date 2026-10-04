const express = require('express');
const router = express.Router();
const { getRankedCandidates, exportCSV, exportPDF } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Add :jobId to filter candidates by the specific job
router.get('/:jobId/ranking', protect, getRankedCandidates);
router.post('/:jobId/export/csv', protect, exportCSV);
router.post('/:jobId/export/pdf', protect, exportPDF);

module.exports = router;
