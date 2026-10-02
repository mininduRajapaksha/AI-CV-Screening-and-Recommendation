const express = require("express")
const { startScreening, getScreeningStatus, getActiveScreening, cancelScreening } = require("../controllers/screeningController")

const { protect } = require("../middleware/authMiddleware");

const router = express.Router()

//cv screening
router.post("/start",protect, startScreening)

router.get("/active", protect, getActiveScreening);

router.post("/:id/cancel", protect, cancelScreening);

//screening progress status
router.get("/:id",protect, getScreeningStatus)

module.exports = router