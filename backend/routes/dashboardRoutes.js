const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/dashboard/recent-jobs
router.get('/recent-jobs', dashboardController.getRecentJobs);

module.exports = router;