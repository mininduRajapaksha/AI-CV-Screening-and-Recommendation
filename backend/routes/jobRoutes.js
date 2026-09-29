const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('HR Manager', 'Admin'), createJob)
  .get(protect, getAllJobs);

router.route('/:id')
  .get(protect, getJobById)
  .put(protect, authorize('HR Manager', 'Admin'), updateJob)
  .delete(protect, authorize('HR Manager', 'Admin'), deleteJob);

module.exports = router;
