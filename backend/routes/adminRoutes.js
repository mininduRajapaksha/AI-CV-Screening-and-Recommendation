const express = require('express');
const router = express.Router();
const { getSystemStatus, updateApiConfig } = require('../controllers/adminController');

router.get('/status', getSystemStatus);
router.post('/config', updateApiConfig);

module.exports = router;