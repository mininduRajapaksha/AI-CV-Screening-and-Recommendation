const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();

    let countMap = {};
    try {
      const candidateCounts = await Candidate.aggregate([
        { $group: { _id: '$jobId', count: { $sum: 1 } } }
      ]);
      candidateCounts.forEach((c) => {
        countMap[String(c._id)] = c.count;
      });
    } catch (countErr) {
      console.warn('Candidate count aggregation failed:', countErr.message);
    }

    const formattedJobs = jobs.map((j) => ({
      ...j,
      applications: countMap[String(j._id)] || 0,
      postedDate: j.createdAt,
    }));

    res.status(200).json(formattedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ message: 'Job not found' });

    let applications = 0;
    try {
      applications = await Candidate.countDocuments({ jobId: req.params.id });
    } catch {}

    res.status(200).json({ ...job, applications, postedDate: job.createdAt });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
};

exports.closeJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'Closed' }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job closed successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error closing job', error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};
