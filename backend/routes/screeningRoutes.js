const express = require("express")
const { startScreening } = require("../controllers/screeningController")

const router = express.Router()

router.post("/start", startScreening)

module.exports = router