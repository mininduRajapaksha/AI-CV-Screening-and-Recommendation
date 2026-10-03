const express = require("express")
const { startScreening, getScreeningStatus, getActiveScreening, cancelScreening, getScreeningReadiness } = require("../controllers/screeningController")

const { protect } = require("../middleware/authMiddleware");

const router = express.Router()

//cv screening
router.post("/start",protect, startScreening)

router.get("/active", protect, getActiveScreening);

//// Check screening service readiness
//check worker and ai is running
router.get("/:id",protect, getScreeningReadiness)

router.post("/:id/cancel", protect, cancelScreening);

//screening progress status
router.get("/:id",protect, getScreeningStatus)

module.exports = router