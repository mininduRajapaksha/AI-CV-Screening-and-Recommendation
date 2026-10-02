const express = require("express");

const {
    getProfile,
    updateProfile,
    updatePassword
} = require("../controllers/profileController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get current user's profile

router.get("/", protect, getProfile);


// Update current user's name

router.patch("/", protect, updateProfile);


// Update current user's password

router.patch("/password", protect, updatePassword);


module.exports = router;