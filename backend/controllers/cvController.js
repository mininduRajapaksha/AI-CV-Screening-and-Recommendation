const CV = require("../models/CV")
const cvQueue = require("../queues/cvQueue")

const singleCV = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No CV file uploaded"
            })
        }

        // Save CV information in MongoDB
        const cv = await CV.create({
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype
        })

        // Add CV processing job to BullMQ
        const job = await cvQueue.add("process-cv", {
            cvId: cv._id.toString()
        })

        res.status(201).json({
            success: true,
            message: "CV uploaded and added to processing queue",
            cv: {
                id: cv._id,
                originalName: cv.originalName,
                status: cv.status
            },
            jobId: job.id
        })

    } catch (error) {
        next(error)
    }
}


const multipleCVs = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No CV files uploaded"
            })
        }

        const cvs = []

        for (const file of req.files) {

            // Save each CV to MongoDB
            const cv = await CV.create({
                originalName: file.originalname,
                fileName: file.filename,
                filePath: file.path,
                fileSize: file.size,
                fileType: file.mimetype
            })

            // Add each CV to BullMQ
            const job = await cvQueue.add("process-cv", {
                cvId: cv._id.toString()
            })

            cvs.push({
                id: cv._id,
                originalName: cv.originalName,
                status: cv.status,
                jobId: job.id
            })
        }

        res.status(201).json({
            success: true,
            message: `${cvs.length} CV(s) uploaded and added to processing queue`,
            cvs
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    singleCV,
    multipleCVs
}