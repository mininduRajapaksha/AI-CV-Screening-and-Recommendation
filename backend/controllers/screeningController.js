const Screening = require("../models/Screening")
const CV = require("../models/CV")
const cvQueue = require("../queues/cvQueue")

const startScreening = async (req, res, next) => {

    try {

        const { jobId, cvIds } = req.body

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            })
        }

        if (!cvIds || !Array.isArray(cvIds) || cvIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one CV is required"
            })
        }

        const cvs = await CV.find({
            _id: { $in: cvIds }
        })

        if (cvs.length !== cvIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more CVs were not found"
            })
        }

        const screening = await Screening.create({
            jobId,
            cvIds,
            totalCVs: cvs.length,
            status: "processing"
        })

        for (const cv of cvs) {

            await cvQueue.add("process-cv", {
                cvId: cv._id.toString(),
                screeningId: screening._id.toString(),
                jobId
            })

        }

        res.status(201).json({
            success: true,
            message: "CV screening started",
            screeningId: screening._id,
            totalCVs: cvs.length
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    startScreening
}