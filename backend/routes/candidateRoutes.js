const express = require('express');
const router = express.Router();

// Placeholder for Candidate Routes (CV Upload, Get Candidates)
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Candidate API is working' });
});

module.exports = router;
