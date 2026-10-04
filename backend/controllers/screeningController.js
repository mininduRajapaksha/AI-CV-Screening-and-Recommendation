const axios = require("axios")
const Redis = require("ioredis")
const mongoose = require("mongoose")

const Screening = require("../models/Screening")
const CV = require("../models/CV")
const cvQueue = require("../queues/cvQueue")


/*
|--------------------------------------------------------------------------
| Redis Connection
|--------------------------------------------------------------------------
*/

const redis = new Redis({

    host:
        process.env.REDIS_HOST,

    port:
        Number(
            process.env.REDIS_PORT
        ),

    username:
        process.env.REDIS_USERNAME,

    password:
        process.env.REDIS_PASSWORD,

    maxRetriesPerRequest: null
})


const WORKER_HEARTBEAT_KEY =
    "cv-worker:heartbeat"


/*
|--------------------------------------------------------------------------
| Check Screening Readiness
|--------------------------------------------------------------------------
*/

const checkScreeningReadiness = async () => {

    let database = false
    let redisStatus = false
    let aiService = false
    let worker = false


    /*
    |--------------------------------------------------------------------------
    | MongoDB
    |--------------------------------------------------------------------------
    */

    try {

        database =
            mongoose.connection.readyState === 1

    } catch (error) {

        database = false
    }


    /*
    |--------------------------------------------------------------------------
    | Redis
    |--------------------------------------------------------------------------
    */

    try {

        await redis.ping()

        redisStatus = true

    } catch (error) {

        redisStatus = false
    }


    /*
    |--------------------------------------------------------------------------
    | AI Service
    |--------------------------------------------------------------------------
    */

    try {

        const response =
            await axios.get(
                `${process.env.AI_SERVICE_URL}/health`,
                {
                    timeout: 3000
                }
            )


        aiService =
            response.status === 200 &&
            response.data?.status === "healthy"

    } catch (error) {

        aiService = false
    }


    /*
    |--------------------------------------------------------------------------
    | CV Worker
    |--------------------------------------------------------------------------
    */

    try {

        const heartbeat =
            await redis.get(
                WORKER_HEARTBEAT_KEY
            )


        if (heartbeat) {

            const heartbeatAge =
                Date.now() -
                Number(heartbeat)


            worker =
                heartbeatAge < 15000
        }

    } catch (error) {

        worker = false
    }


    /*
    |--------------------------------------------------------------------------
    | Overall Readiness
    |--------------------------------------------------------------------------
    */

    const ready =
        database &&
        redisStatus &&
        aiService &&
        worker


    return {
        ready,

        services: {
            database,
            redis: redisStatus,
            aiService,
            worker
        }
    }
}


/*
|--------------------------------------------------------------------------
| Readiness API Endpoint
|--------------------------------------------------------------------------
*/

const getScreeningReadiness = async (
    req,
    res,
    next
) => {

    try {

        const readiness =
            await checkScreeningReadiness()


        res.status(
            readiness.ready
                ? 200
                : 503
        ).json({

            success: true,

            ready:
                readiness.ready,

            services:
                readiness.services
        })

    } catch (error) {

        next(error)
    }
}


/*
|--------------------------------------------------------------------------
| Start Screening
|--------------------------------------------------------------------------
*/

const startScreening = async (
    req,
    res,
    next
) => {

    try {

        const {
            jobId,
            cvIds
        } = req.body


        /*
        |--------------------------------------------------------------------------
        | Validate Job ID
        |--------------------------------------------------------------------------
        */

        if (!jobId) {

            return res.status(400).json({

                success: false,

                message:
                    "Job ID is required"
            })
        }


        /*
        |--------------------------------------------------------------------------
        | Validate CV IDs
        |--------------------------------------------------------------------------
        */

        if (
            !cvIds ||
            !Array.isArray(cvIds) ||
            cvIds.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "At least one CV is required"
            })
        }


        /*
        |--------------------------------------------------------------------------
        | Check Service Readiness
        |--------------------------------------------------------------------------
        */

        const readiness =
            await checkScreeningReadiness()


        if (!readiness.ready) {

            const services =
                readiness.services


            let message =
                "Screening services are not ready."


            if (!services.database) {

                message =
                    "Database service is unavailable."

            } else if (!services.redis) {

                message =
                    "Redis service is unavailable."

            } else if (!services.aiService) {

                message =
                    "AI service is unavailable. Please start the AI service and try again."

            } else if (!services.worker) {

                message =
                    "CV processing worker is not running. Please start the worker and try again."
            }


            return res.status(503).json({

                success: false,

                message,

                services
            })
        }


        /*
        |--------------------------------------------------------------------------
        | Find CVs
        |--------------------------------------------------------------------------
        */

        const cvs =
            await CV.find({
                _id: {
                    $in: cvIds
                }
            })


        if (
            cvs.length !==
            cvIds.length
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "One or more CVs were not found"
            })
        }


        /*
        |--------------------------------------------------------------------------
        | Create Screening
        |--------------------------------------------------------------------------
        */

        const screening =
            await Screening.create({

                jobId,

                createdBy:
                    req.user.id,

                cvIds,

                totalCVs:
                    cvs.length,

                status:
                    "processing"
            })


        /*
        |--------------------------------------------------------------------------
        | Add CV Jobs To Queue
        |--------------------------------------------------------------------------
        */

        for (const cv of cvs) {

            await cvQueue.add(
                "process-cv",
                {

                    cvId:
                        cv._id.toString(),

                    screeningId:
                        screening._id.toString(),

                    jobId
                }
            )
        }


        /*
        |--------------------------------------------------------------------------
        | Success Response
        |--------------------------------------------------------------------------
        */

        res.status(201).json({

            success: true,

            message:
                "CV screening started",

            screeningId:
                screening._id,

            totalCVs:
                cvs.length
        })

    } catch (error) {

        next(error)
    }
}


/*
|--------------------------------------------------------------------------
| Get Screening Status
|--------------------------------------------------------------------------
*/

const getScreeningStatus = async (
    req,
    res,
    next
) => {

    try {

        const screening =
            await Screening.findById(
                req.params.id
            )


        if (!screening) {

            return res.status(404).json({

                success: false,

                message:
                    "Screening not found"
            })
        }


        res.status(200).json({

            success: true,

            screening: {

                _id:
                    screening._id,

                jobId:
                    screening.jobId,

                totalCVs:
                    screening.totalCVs,

                completedCVs:
                    screening.completedCVs,

                failedCVs:
                    screening.failedCVs,

                processingErrors:
                    screening.processingErrors || [],

                status:
                    screening.status,

                createdAt:
                    screening.createdAt,

                updatedAt:
                    screening.updatedAt
            }
        })

    } catch (error) {

        next(error)
    }
}


/*
|--------------------------------------------------------------------------
| Get Active Screening
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| "failed" is included here.
|
| Otherwise, when a screening completely fails, the backend returns
| screening: null and the frontend thinks that the screening disappeared.
|
|--------------------------------------------------------------------------
*/

const getActiveScreening = async (
    req,
    res,
    next
) => {

    try {

        const screening =
            await Screening.findOne({

                createdBy:
                    req.user.id,

                status: {
                    $in: [
                        "pending",
                        "processing"
                    ]
                }

            }).sort({
                createdAt: -1
            })


        if (!screening) {

            return res.status(200).json({

                success: true,

                screening: null
            })
        }


        res.status(200).json({

            success: true,

            screening: {

                _id:
                    screening._id,

                jobId:
                    screening.jobId,

                cvIds:
                    screening.cvIds,

                totalCVs:
                    screening.totalCVs,

                completedCVs:
                    screening.completedCVs,

                failedCVs:
                    screening.failedCVs,

                processingErrors:
                    screening.processingErrors || [],

                status:
                    screening.status,

                createdAt:
                    screening.createdAt,

                updatedAt:
                    screening.updatedAt
            }
        })

    } catch (error) {

        next(error)
    }
}


/*
|--------------------------------------------------------------------------
| Cancel Screening
|--------------------------------------------------------------------------
*/

const cancelScreening = async (
    req,
    res,
    next
) => {

    try {

        const screening =
            await Screening.findOne({

                _id:
                    req.params.id,

                createdBy:
                    req.user.id
            })


        if (!screening) {

            return res.status(404).json({

                success: false,

                message:
                    "Screening not found"
            })
        }


        /*
        |--------------------------------------------------------------------------
        | Check Existing Status
        |--------------------------------------------------------------------------
        */

        if (
            screening.status ===
                "complete" ||

            screening.status ===
                "cancelled" ||

            screening.status ===
                "failed"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Screening is already ${screening.status}`
            })
        }


        /*
        |--------------------------------------------------------------------------
        | Remove Queued Jobs
        |--------------------------------------------------------------------------
        */

        const jobs =
            await cvQueue.getJobs([
                "waiting",
                "delayed"
            ])


        for (const job of jobs) {

            if (
                job.data.screeningId ===
                screening._id.toString()
            ) {

                try {

                    await job.remove()

                } catch (error) {

                    console.warn(

                        `Unable to remove queued job ${job.id}:`,

                        error.message
                    )
                }
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Mark Remaining CVs Cancelled
        |--------------------------------------------------------------------------
        */

        await CV.updateMany(

            {
                _id: {
                    $in:
                        screening.cvIds
                },

                status: {
                    $in: [
                        "pending",
                        "processing"
                    ]
                }
            },

            {
                $set: {
                    status:
                        "cancelled"
                }
            }
        )


        /*
        |--------------------------------------------------------------------------
        | Cancel Screening
        |--------------------------------------------------------------------------
        */

        screening.status =
            "cancelled"


        await screening.save()


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        res.status(200).json({

            success: true,

            message:
                "Screening cancelled successfully"
        })

    } catch (error) {

        next(error)
    }
}


/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {

    startScreening,
    getScreeningStatus,
    getActiveScreening,
    cancelScreening,
    getScreeningReadiness
}