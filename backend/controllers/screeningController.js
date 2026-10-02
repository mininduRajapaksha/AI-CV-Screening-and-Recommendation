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
            createdBy: req.user.id,
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

const getScreeningStatus = async (req, res, next) => {
    try {
        const screening = await Screening.findById(req.params.id)

        if (!screening) {
            return res.status(404).json({
                success: false,
                message: "Screening not found"
            })
        }

        res.status(200).json({
            success: true,
            screening: {
                _id: screening._id,
                jobId: screening.jobId,
                totalCVs: screening.totalCVs,
                completedCVs: screening.completedCVs,
                failedCVs: screening.failedCVs,
                errors: screening.errors || [],
                status: screening.status,
                createdAt: screening.createdAt,
                updatedAt: screening.updatedAt
            }
        })
    } catch (error) {
        next(error)
    }
}

const getActiveScreening = async (req, res, next) => {
    try {
        const screening = await Screening.findOne({
            createdBy: req.user.id,
            status: {
                $in: ["pending", "processing"]
            }
        }).sort({ createdAt: -1 });

        if (!screening) {
            return res.status(200).json({
                success: true,
                screening: null
            });
        }

        res.status(200).json({
            success: true,
            screening: {
                _id: screening._id,
                jobId: screening.jobId,
                cvIds: screening.cvIds,
                totalCVs: screening.totalCVs,
                completedCVs: screening.completedCVs,
                failedCVs: screening.failedCVs,
                errors: screening.errors || [],
                status: screening.status,
                createdAt: screening.createdAt,
                updatedAt: screening.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

const cancelScreening = async (req, res, next) => {
    try {
        const screening = await Screening.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!screening) {
            return res.status(404).json({
                success: false,
                message: "Screening not found"
            });
        }

        if (
            screening.status === "complete" ||
            screening.status === "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: `Screening is already ${screening.status}`
            });
        }

        // Active jobs are locked by BullMQ and cannot be removed safely.
        // Marking the screening cancelled tells workers to stop them at the
        // next cancellation check; only queued work is removed here.
        const jobs = await cvQueue.getJobs([
            "waiting",
            "delayed"
        ]);

        for (const job of jobs) {
            if (job.data.screeningId === screening._id.toString()) {
                try {
                    await job.remove();
                } catch (error) {
                    console.warn(
                        `Unable to remove queued job ${job.id}:`,
                        error.message
                    );
                }
            }
        }

        // Mark remaining CVs as cancelled
        await CV.updateMany(
            {
                _id: { $in: screening.cvIds },
                status: { $in: ["pending", "processing"] }
            },
            {
                $set: {
                    status: "cancelled"
                }
            }
        );

        screening.status = "cancelled";

        await screening.save();

        res.status(200).json({
            success: true,
            message: "Screening cancelled successfully"
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    startScreening,
    getScreeningStatus,
    getActiveScreening,
    cancelScreening
}
