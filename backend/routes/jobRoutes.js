const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const allowedRoles = ['HR Manager', 'Recruiter', 'Admin'];

router.route('/')
  .post(protect, authorize(...allowedRoles), createJob)
  .get(protect, getAllJobs);

router.route('/:id')
  .get(protect, getJobById)
  .put(protect, authorize(...allowedRoles), updateJob)
  .patch(protect, authorize(...allowedRoles), updateJob)
  .delete(protect, authorize(...allowedRoles), deleteJob);

router.patch('/:id/close', protect, authorize(...allowedRoles), closeJob);

module.exports = router;
