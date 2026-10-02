const express = require("express")

const upload = require("../middleware/uploadMiddleware")

const {singleCV, multipleCVs, getCVsByIds} = require("../controllers/cvController")

const router = express.Router()

//single cv upload
router.post('/upload', upload.single('cv'), singleCV)

//Multiple cvs upload
router.post('/upload-multiple/', upload.array('cvs', 50), multipleCVs)

router.get("/by-ids", getCVsByIds);

module.exports = router