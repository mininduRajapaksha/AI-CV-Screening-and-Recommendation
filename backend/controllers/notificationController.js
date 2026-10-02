const Screening = require('../models/Screening');
const CV = require('../models/CV');
const Job = require('../models/Job');
const User = require('../models/User');

//Role helpers

const HR_ROLES  = ['HR Manager', 'Recruiter'];
const isHR      = (role) => HR_ROLES.includes(role);
const isAdmin   = (role) => role === 'Admin';

// Both HR and Admin see these
const isHROrAdmin = (role) => isHR(role) || isAdmin(role);

//Time helper

/** Detect if a document was meaningfully updated after creation (>5 s gap). */
const wasUpdated = (doc) =>
  Math.abs(new Date(doc.updatedAt) - new Date(doc.createdAt)) > 5_000;

//Main endpoint
exports.getNotifications = async (req, res) => {
  try {
    const role = req.user?.role;
    const events = [];

    //Job notifications (HR + Admin)
    if (isHROrAdmin(role)) {
      const jobs = await Job.find()
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

      for (const job of jobs) {
        if (job.status === 'Closed') {
          events.push({
            id: `job-closed-${job._id}`,
            type: 'warning',
            title: 'Job Closed',
            message: `"${job.title}" in ${job.department} has been closed.`,
            time: job.updatedAt,
          });
        } else if (job.status === 'Draft' && isHR(role)) {
          // Draft saved — HR only
          events.push({
            id: `job-draft-${job._id}`,
            type: 'info',
            title: 'Job Draft Saved',
            message: `"${job.title}" in ${job.department} was saved as a draft.`,
            time: job.updatedAt,
          });
        } else if (wasUpdated(job)) {
          events.push({
            id: `job-updated-${job._id}`,
            type: 'info',
            title: 'Job Updated',
            message: `"${job.title}" (${job.department}) has been updated.`,
            time: job.updatedAt,
          });
        } else {
          events.push({
            id: `job-posted-${job._id}`,
            type: 'success',
            title: 'Job Posted',
            message: `"${job.title}" in ${job.department} is now ${job.status.toLowerCase()}.`,
            time: job.createdAt,
          });
        }
      }
    }

    //CV upload notifications (HR only)
    if (isHR(role)) {
      const recentCVs = await CV.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      // Group into a single "N CVs uploaded" event per batch window (1 h)
      if (recentCVs.length > 0) {
        const batchGroups = {};
        for (const cv of recentCVs) {
          // Round to nearest hour to group uploads
          const bucket = new Date(cv.createdAt);
          bucket.setMinutes(0, 0, 0);
          const key = bucket.toISOString();
          if (!batchGroups[key]) batchGroups[key] = { count: 0, time: cv.createdAt };
          batchGroups[key].count++;
        }

        for (const [key, { count, time }] of Object.entries(batchGroups)) {
          events.push({
            id: `cv-upload-${key}`,
            type: 'info',
            title: 'CV Upload Completed',
            message: `${count} CV${count !== 1 ? 's were' : ' was'} uploaded successfully.`,
            time,
          });
        }
      }
    }

    //Screening notifications (HR + Admin)
    if (isHROrAdmin(role)) {
      const screenings = await Screening.find({
        status: { $in: ['complete', 'failed'] },
      })
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

      for (const s of screenings) {
        if (s.status === 'complete' && s.failedCVs > 0) {
          // Partially failed
          events.push({
            id: `screening-partial-${s._id}`,
            type: 'warning',
            title: 'Screening Partially Failed',
            message: `${s.completedCVs} CV${s.completedCVs !== 1 ? 's' : ''} screened; ${s.failedCVs} failed.`,
            time: s.updatedAt,
          });
        } else if (s.status === 'complete') {
          events.push({
            id: `screening-complete-${s._id}`,
            type: 'success',
            title: 'Screening Completed',
            message: `${s.completedCVs} CV${s.completedCVs !== 1 ? 's were' : ' was'} screened successfully.`,
            time: s.updatedAt,
          });
        } else {
          // failed
          events.push({
            id: `screening-failed-${s._id}`,
            type: 'error',
            title: 'Screening Failed',
            message: `A screening batch of ${s.totalCVs} CV${s.totalCVs !== 1 ? 's' : ''} failed to complete.`,
            time: s.updatedAt,
          });
        }
      }
    }

    //Admin-only notifications
    if (isAdmin(role)) {
      // New user registered (last 30 days)
      const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const newUsers = await User.find({ createdAt: { $gte: since30d } })
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      for (const u of newUsers) {
        events.push({
          id: `user-registered-${u._id}`,
          type: 'info',
          title: 'New User Registered',
          message: `${u.name} joined as ${u.role}.`,
          time: u.createdAt,
        });
      }

      // User deactivated (Inactive status, updated recently)
      const deactivatedUsers = await User.find({ status: 'Inactive' })
        .select('-password')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean();

      for (const u of deactivatedUsers) {
        events.push({
          id: `user-deactivated-${u._id}`,
          type: 'warning',
          title: 'User Deactivated',
          message: `${u.name}'s account (${u.role}) has been deactivated.`,
          time: u.updatedAt,
        });
      }

      // User role changed — best proxy: active users whose updatedAt differs significantly from createdAt
      const roleChangedUsers = await User.find({
        status: 'Active',
        $expr: { $gt: [{ $subtract: ['$updatedAt', '$createdAt'] }, 5000] },
      })
        .select('-password')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean();

      for (const u of roleChangedUsers) {
        events.push({
          id: `user-role-changed-${u._id}`,
          type: 'info',
          title: 'User Role Changed',
          message: `${u.name}'s role is now "${u.role}".`,
          time: u.updatedAt,
        });
      }
    }

    //Sort by time desc, cap at 20
    events.sort((a, b) => new Date(b.time) - new Date(a.time));
    const notifications = events.slice(0, 20);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Count-only endpoint

/**
 * GET /api/notifications/count
 * Lightweight endpoint returning the count of recent events for the badge.
 */
exports.getNotificationCount = async (req, res) => {
  try {
    const role = req.user?.role;
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since30d  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const promises = [];

    if (isHROrAdmin(role)) {
      promises.push(
        Job.countDocuments({ updatedAt: { $gte: since24h } }),
        Screening.countDocuments({ status: { $in: ['complete', 'failed'] }, updatedAt: { $gte: since24h } }),
      );
    }

    if (isHR(role)) {
      promises.push(CV.countDocuments({ createdAt: { $gte: since24h } }));
    }

    if (isAdmin(role)) {
      promises.push(
        User.countDocuments({ createdAt: { $gte: since30d } }),
        User.countDocuments({ status: 'Inactive', updatedAt: { $gte: since24h } }),
      );
    }

    const counts = await Promise.all(promises);
    const count = counts.reduce((sum, n) => sum + n, 0);

    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
