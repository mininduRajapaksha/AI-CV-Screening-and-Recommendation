const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// GET /api/candidates 
// Route to fetch all candidates from the database (used for full dashboard view)
router.get('/', candidateController.getAllCandidates);

// GET /api/candidates/job/:jobId 
// Route to fetch all candidates associated with a specific Job ID
router.get('/job/:jobId', candidateController.getCandidatesByJob);

// GET /api/candidates/:id 
// Route to fetch full profile details of a specific candidate by their MongoDB document ID
router.get('/:id', candidateController.getCandidateDetails);

// POST /api/candidates/save 
// Route to securely save AI-extracted candidate data into the MongoDB database
router.post('/save', candidateController.saveCandidate);

module.exports = router;