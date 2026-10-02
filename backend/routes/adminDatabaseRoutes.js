const express = require("express");
const router = express.Router();

const {getDatabaseStatus} = require("../controllers/adminDatabaseController");

const { protect } = require("../middleware/authMiddleware");

router.get("/database-status", protect, getDatabaseStatus);

module.exports = router;