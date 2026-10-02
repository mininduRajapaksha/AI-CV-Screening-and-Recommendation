const express = require('express');
const router = express.Router();
const { getNotifications, getNotificationCount } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/notifications        — full list
router.get('/', protect, getNotifications);

// GET /api/notifications/count  — lightweight count-only
router.get('/count', protect, getNotificationCount);

module.exports = router;
