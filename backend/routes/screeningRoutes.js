const express = require("express")
const { startScreening, getScreeningStatus } = require("../controllers/screeningController")

const router = express.Router()

//cv screening
router.post("/start", startScreening)

//screening progress status
router.get("/:id", getScreeningStatus)

module.exports = router