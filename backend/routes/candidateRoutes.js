const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// GET /api/candidates/job/:jobId (Get candidates by Job ID)
router.get('/job/:jobId', candidateController.getCandidatesByJob);

// GET /api/candidates/:id (Get specific candidate details)
router.get('/:id', candidateController.getCandidateDetails);

module.exports = router;