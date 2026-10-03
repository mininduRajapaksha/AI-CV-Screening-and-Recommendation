const express = require("express");

const {
    startScreening,
    getScreeningStatus,
    getActiveScreening,
    cancelScreening,
    getScreeningReadiness
} = require("../controllers/screeningController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// Start screening
router.post(
    "/start",
    protect,
    startScreening
);


// Active screening
router.get(
    "/active",
    protect,
    getActiveScreening
);


// Readiness
router.get(
    "/readiness",
    protect,
    getScreeningReadiness
);


// Cancel screening
router.post(
    "/:id/cancel",
    protect,
    cancelScreening
);


// Screening status
router.get(
    "/:id",
    protect,
    getScreeningStatus
);


module.exports = router;