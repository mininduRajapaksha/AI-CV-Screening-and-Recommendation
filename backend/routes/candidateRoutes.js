const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// GET /api/candidates/job/:jobId 
// Route to get all candidates for a specific Job ID
router.get('/job/:jobId', candidateController.getCandidatesByJob);

// GET /api/candidates/:id 
// Route to get full profile details of a specific candidate by their MongoDB ID
router.get('/:id', candidateController.getCandidateDetails);

// POST /api/candidates/save 
// Route to save AI-extracted candidate data into the MongoDB database
router.post('/save', candidateController.saveCandidate);

module.exports = router;
