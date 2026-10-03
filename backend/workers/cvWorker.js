require("dotenv").config()

const { Worker } = require("bullmq")
const IORedis = require("ioredis")

const connectDB = require("../config/db")

const CV = require("../models/CV")
const Screening = require("../models/Screening")
const Job = require("../models/job")
const Candidate = require("../models/Candidate")

const { processCV } = require("../services/aiService")


/*
|--------------------------------------------------------------------------
| Failure Message Helper
|--------------------------------------------------------------------------
|
| Converts technical AI/service errors into messages that are safe
| and understandable for the frontend.
|
|--------------------------------------------------------------------------
*/

const getFailureMessage = (error) => {

    const status =
        error.response?.status

    const rawMessage =
        String(
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            ""
        ).toLowerCase()


    /*
    |--------------------------------------------------------------------------
    | Rate Limit
    |--------------------------------------------------------------------------
    */

    if (status === 429) {

        return (
            "AI service rate limit reached. " +
            "Please try again later."
        )
    }


    /*
    |--------------------------------------------------------------------------
    | Gemini Quota / Token Limit
    |--------------------------------------------------------------------------
    */

    if (
        rawMessage.includes("quota") ||
        rawMessage.includes("token limit")
    ) {

        return (
            "AI service usage limit reached. " +
            "Please try again later."
        )
    }


    /*
    |--------------------------------------------------------------------------
    | AI Service Busy
    |--------------------------------------------------------------------------
    */

    if (
        rawMessage.includes("busy") ||
        rawMessage.includes("overloaded")
    ) {

        return (
            "AI service is busy. " +
            "Please try again later."
        )
    }


    /*
    |--------------------------------------------------------------------------
    | AI Service Server Error
    |--------------------------------------------------------------------------
    */

    if (status >= 500) {

        return (
            "AI service is temporarily unavailable. " +
            "Please try again later."
        )
    }


    /*
    |--------------------------------------------------------------------------
    | Connection Errors
    |--------------------------------------------------------------------------
    */

    if (
        [
            "ECONNREFUSED",
            "ETIMEDOUT",
            "ECONNABORTED"
        ].includes(error.code)
    ) {

        return (
            "AI service is unavailable. " +
            "Please try again later."
        )
    }


    /*
    |--------------------------------------------------------------------------
    | Default Error
    |--------------------------------------------------------------------------
    */

    return (
        error.message ||
        "An unexpected error occurred while screening this CV."
    )
}


/*
|--------------------------------------------------------------------------
| Worker Heartbeat
|--------------------------------------------------------------------------
|
| The worker writes a heartbeat to Redis every 5 seconds.
|
| The heartbeat key expires after 15 seconds.
|
| The backend uses this to determine whether the worker is running.
|
|--------------------------------------------------------------------------
*/

const WORKER_HEARTBEAT_KEY =
    "cv-worker:heartbeat"


const updateWorkerHeartbeat = async (
    connection
) => {

    try {

        await connection.set(
            WORKER_HEARTBEAT_KEY,
            Date.now().toString(),
            "EX",
            15
        )

    } catch (error) {

        console.error(
            "Worker heartbeat error:",
            error.message
        )
    }
}


/*
|--------------------------------------------------------------------------
| Start Worker
|--------------------------------------------------------------------------
*/

const startWorker = async () => {


    /*
    |--------------------------------------------------------------------------
    | Connect MongoDB
    |--------------------------------------------------------------------------
    */

    await connectDB()

    console.log(
        "MongoDB connection ready for worker"
    )


    /*
    |--------------------------------------------------------------------------
    | Redis Configuration
    |--------------------------------------------------------------------------
    */

    const redisConnection = {

        host:
            process.env.REDIS_HOST,

        port:
            Number(
                process.env.REDIS_PORT
            ),

        username:
            process.env.REDIS_USERNAME,

        password:
            process.env.REDIS_PASSWORD
    }


    /*
    |--------------------------------------------------------------------------
    | Create BullMQ Worker
    |--------------------------------------------------------------------------
    */

    const worker = new Worker(

        "cv-processing",

        async (job) => {

            const {
                cvId,
                screeningId,
                jobId
            } = job.data


            console.log(
                `Processing CV: ${cvId}`
            )

            console.log(
                `Job ID: ${jobId}`
            )


            /*
            |--------------------------------------------------------------------------
            | Find CV
            |--------------------------------------------------------------------------
            */

            const cv =
                await CV.findById(
                    cvId
                )


            if (!cv) {

                throw new Error(
                    "CV record not found"
                )
            }


            /*
            |--------------------------------------------------------------------------
            | Find Screening
            |--------------------------------------------------------------------------
            */

            const screening =
                await Screening.findById(
                    screeningId
                )


            if (!screening) {

                throw new Error(
                    "Screening record not found"
                )
            }


            /*
            |--------------------------------------------------------------------------
            | Check Cancellation
            |--------------------------------------------------------------------------
            */

            if (
                screening.status ===
                "cancelled"
            ) {

                cv.status =
                    "cancelled"

                cv.errorMessage =
                    null

                await cv.save()


                console.log(
                    `Skipping cancelled screening: ${screeningId}`
                )

                return
            }


            /*
            |--------------------------------------------------------------------------
            | Find Job Posting
            |--------------------------------------------------------------------------
            */

            const jobPosting =
                await Job.findById(
                    jobId
                )


            if (!jobPosting) {

                throw new Error(
                    "Job posting not found"
                )
            }


            console.log(
                `Job found: ${jobPosting.title}`
            )


            /*
            |--------------------------------------------------------------------------
            | Mark CV As Processing
            |--------------------------------------------------------------------------
            */

            cv.status =
                "processing"

            cv.errorMessage =
                null

            await cv.save()


            /*
            |--------------------------------------------------------------------------
            | Prepare Job Description
            |--------------------------------------------------------------------------
            */

            const jobDescription = `
Job Title: ${jobPosting.title}
Department: ${jobPosting.department}
Location: ${jobPosting.location}
Employment Type: ${jobPosting.employmentType}
Experience Level: ${jobPosting.experienceLevel}
Salary Range: ${jobPosting.salaryRange || "Not specified"}

Job Description:
${jobPosting.description}

Required Skills:
${
    jobPosting.skills &&
    jobPosting.skills.length > 0
        ? jobPosting.skills.join(", ")
        : "Not specified"
}
`


            console.log(
                "Job description prepared."
            )


            console.log(
                "Sending CV to AI service..."
            )


            /*
            |--------------------------------------------------------------------------
            | AI Processing
            |--------------------------------------------------------------------------
            */

            const aiResponse =
                await processCV(
                    cv.filePath,
                    jobDescription
                )


            console.log(
                "AI Response:"
            )


            console.log(
                JSON.stringify(
                    aiResponse,
                    null,
                    2
                )
            )


            /*
            |--------------------------------------------------------------------------
            | Validate AI Response
            |--------------------------------------------------------------------------
            */

            if (
                !aiResponse ||
                aiResponse.success === false
            ) {

                throw new Error(
                    aiResponse?.error ||
                    "AI processing failed"
                )
            }


            const candidateData =
                aiResponse.candidate


            const evaluation =
                aiResponse.evaluation


            if (!candidateData) {

                throw new Error(
                    "Candidate data missing from AI response"
                )
            }


            if (!evaluation) {

                throw new Error(
                    "Evaluation data missing from AI response"
                )
            }


            /*
            |--------------------------------------------------------------------------
            | Check Cancellation Again
            |--------------------------------------------------------------------------
            |
            | The user may cancel the screening while the AI request
            | is still processing.
            |
            |--------------------------------------------------------------------------
            */

            const currentScreening =
                await Screening.findById(
                    screeningId
                )


            if (
                !currentScreening ||
                currentScreening.status ===
                    "cancelled"
            ) {

                cv.status =
                    "cancelled"

                cv.errorMessage =
                    null

                await cv.save()


                console.log(
                    `Discarding result for cancelled screening: ${screeningId}`
                )

                return
            }


            /*
            |--------------------------------------------------------------------------
            | Save Candidate
            |--------------------------------------------------------------------------
            */

            const candidate =
                await Candidate.create({

                    jobId:
                        jobId,


                    /*
                    |--------------------------------------------------------------------------
                    | Candidate Personal Information
                    |--------------------------------------------------------------------------
                    */

                    personalInfo: {

                        name:
                            candidateData
                                .personalInfo
                                ?.name ||
                            "Unknown Candidate",

                        email:
                            candidateData
                                .personalInfo
                                ?.email ||
                            "",

                        phone:
                            candidateData
                                .personalInfo
                                ?.phone ||
                            ""
                    },


                    /*
                    |--------------------------------------------------------------------------
                    | Agent 02 Fields
                    |--------------------------------------------------------------------------
                    */

                    matchPercentage:
                        evaluation
                            .matchPercentage ||
                        0,

                    matchedSkills:
                        evaluation
                            .matchedSkills ||
                        [],

                    missingSkills:
                        evaluation
                            .missingSkills ||
                        [],


                    /*
                    |--------------------------------------------------------------------------
                    | Agent 03 Fields
                    |--------------------------------------------------------------------------
                    |
                    | These remain here because Agent 03 will use/update
                    | these fields later.
                    |
                    |--------------------------------------------------------------------------
                    */

                    aiRecommendation:
                        "Pending",

                    justification:
                        "Awaiting Agent 03 evaluation",


                    /*
                    |--------------------------------------------------------------------------
                    | Candidate Experience and Education
                    |--------------------------------------------------------------------------
                    */

                    experience:
                        candidateData
                            .experience ||
                        [],

                    education:
                        candidateData
                            .education ||
                        []
                })


            console.log(
                `Candidate saved successfully: ${candidate._id}`
            )


            /*
            |--------------------------------------------------------------------------
            | Check Cancellation Before Updating Screening
            |--------------------------------------------------------------------------
            */

            const screeningToUpdate =
                await Screening.findById(
                    screeningId
                )


            if (
                !screeningToUpdate ||
                screeningToUpdate.status ===
                    "cancelled"
            ) {

                cv.status =
                    "cancelled"

                cv.errorMessage =
                    null

                await cv.save()


                console.log(
                    `Discarding result for cancelled screening: ${screeningId}`
                )

                return
            }


            /*
            |--------------------------------------------------------------------------
            | Mark CV Complete
            |--------------------------------------------------------------------------
            */

            cv.status =
                "complete"

            cv.errorMessage =
                null

            await cv.save()


            /*
            |--------------------------------------------------------------------------
            | Update Screening Progress
            |--------------------------------------------------------------------------
            */

            screeningToUpdate.completedCVs +=
                1


            const processedCVs =
                screeningToUpdate.completedCVs +
                screeningToUpdate.failedCVs


            if (
                processedCVs >=
                screeningToUpdate.totalCVs
            ) {

                /*
                |--------------------------------------------------------------
                | If at least one CV completed successfully,
                | the screening is considered complete.
                |
                | If every CV failed, the screening is failed.
                |--------------------------------------------------------------
                */

                screeningToUpdate.status =
                    screeningToUpdate.completedCVs > 0
                        ? "complete"
                        : "failed"
            }


            await screeningToUpdate.save()


            console.log(
                `Screening progress: ${processedCVs}/${screeningToUpdate.totalCVs}`
            )


            console.log(
                `CV ${cvId} processed successfully.`
            )
        },


        {
            connection:
                redisConnection
        }
    )


    /*
    |--------------------------------------------------------------------------
    | Separate Redis Connection For Worker Heartbeat
    |--------------------------------------------------------------------------
    |
    | Do NOT use worker.client here.
    |
    | BullMQ does not expose the connection that way in this setup.
    |
    |--------------------------------------------------------------------------
    */

    const heartbeatConnection =
        new IORedis({

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

            maxRetriesPerRequest:
                null
        })


    /*
    |--------------------------------------------------------------------------
    | Start Heartbeat
    |--------------------------------------------------------------------------
    */

    const heartbeatInterval =
        setInterval(
            () => {

                updateWorkerHeartbeat(
                    heartbeatConnection
                )

            },
            5000
        )


    /*
    |--------------------------------------------------------------------------
    | Create Initial Heartbeat
    |--------------------------------------------------------------------------
    */

    await updateWorkerHeartbeat(
        heartbeatConnection
    )


    /*
    |--------------------------------------------------------------------------
    | Job Completed
    |--------------------------------------------------------------------------
    */

    worker.on(
        "completed",
        (job) => {

            console.log(
                `Job ${job.id} completed successfully.`
            )
        }
    )


    /*
    |--------------------------------------------------------------------------
    | Job Failed
    |--------------------------------------------------------------------------
    */

    worker.on(
        "failed",
        async (job, error) => {

            console.error(
                `Job ${job?.id} failed:`,
                error.message
            )


            if (!job) {
                return
            }


            try {

                const {
                    cvId,
                    screeningId
                } = job.data


                /*
                |--------------------------------------------------------------------------
                | Convert Technical Error To User-Friendly Message
                |--------------------------------------------------------------------------
                */

                const failureMessage =
                    getFailureMessage(
                        error
                    )


                /*
                |--------------------------------------------------------------------------
                | Find Screening
                |--------------------------------------------------------------------------
                */

                const screeningForFailure =
                    await Screening.findById(
                        screeningId
                    )


                if (
                    !screeningForFailure ||
                    screeningForFailure.status ===
                        "cancelled"
                ) {

                    return
                }


                /*
                |--------------------------------------------------------------------------
                | Mark CV Failed
                |--------------------------------------------------------------------------
                */

                const cv =
                    await CV.findById(
                        cvId
                    )


                if (cv) {

                    cv.status =
                        "failed"

                    cv.errorMessage =
                        failureMessage

                    await cv.save()


                    console.log(
                        `CV ${cvId} marked as failed.`
                    )
                }


                /*
                |--------------------------------------------------------------------------
                | Find Screening Again
                |--------------------------------------------------------------------------
                */

                const screening =
                    await Screening.findById(
                        screeningId
                    )


                if (!screening) {

                    console.error(
                        `Screening ${screeningId} not found.`
                    )

                    return
                }


                /*
                |--------------------------------------------------------------------------
                | Check Cancellation
                |--------------------------------------------------------------------------
                */

                if (
                    screening.status ===
                    "cancelled"
                ) {

                    return
                }


                /*
                |--------------------------------------------------------------------------
                | Increment Failed CV Count
                |--------------------------------------------------------------------------
                */

                screening.failedCVs +=
                    1


                /*
                |--------------------------------------------------------------------------
                | Store Processing Error
                |--------------------------------------------------------------------------
                |
                | IMPORTANT:
                | We use "processingErrors" instead of "errors"
                | because "errors" is a reserved Mongoose pathname.
                |
                |--------------------------------------------------------------------------
                */

                screening.processingErrors =
                    screening.processingErrors || []


                screening.processingErrors.push({

                    cvId,

                    message:
                        failureMessage
                })


                /*
                |--------------------------------------------------------------------------
                | Calculate Progress
                |--------------------------------------------------------------------------
                */

                const processedCVs =
                    screening.completedCVs +
                    screening.failedCVs


                /*
                |--------------------------------------------------------------------------
                | Check If Screening Finished
                |--------------------------------------------------------------------------
                */

                if (
                    processedCVs >=
                    screening.totalCVs
                ) {

                    screening.status =
                        screening.completedCVs > 0
                            ? "complete"
                            : "failed"
                }


                /*
                |--------------------------------------------------------------------------
                | Save Screening
                |--------------------------------------------------------------------------
                */

                await screening.save()


                console.log(
                    `Screening progress: ${processedCVs}/${screening.totalCVs}`
                )

                console.log(
                    `Screening status: ${screening.status}`
                )

            } catch (updateError) {

                console.error(
                    "Error updating failed CV/screening:",
                    updateError
                )
            }
        }
    )


    /*
    |--------------------------------------------------------------------------
    | Worker Error
    |--------------------------------------------------------------------------
    */

    worker.on(
        "error",
        (error) => {

            console.error(
                "CV worker error:",
                error.message
            )
        }
    )


    /*
    |--------------------------------------------------------------------------
    | Worker Ready
    |--------------------------------------------------------------------------
    */

    worker.on(
        "ready",
        async () => {

            console.log(
                "CV processing worker is ready."
            )


            await updateWorkerHeartbeat(
                heartbeatConnection
            )
        }
    )


    /*
    |--------------------------------------------------------------------------
    | Graceful Shutdown
    |--------------------------------------------------------------------------
    */

    const shutdown = async () => {

        console.log(
            "Shutting down CV processing worker..."
        )


        /*
        |--------------------------------------------------------------------------
        | Stop Heartbeat
        |--------------------------------------------------------------------------
        */

        clearInterval(
            heartbeatInterval
        )


        /*
        |--------------------------------------------------------------------------
        | Remove Heartbeat From Redis
        |--------------------------------------------------------------------------
        */

        try {

            await heartbeatConnection.del(
                WORKER_HEARTBEAT_KEY
            )

        } catch (error) {

            console.error(
                "Unable to remove worker heartbeat:",
                error.message
            )
        }


        /*
        |--------------------------------------------------------------------------
        | Close Heartbeat Redis Connection
        |--------------------------------------------------------------------------
        */

        try {

            await heartbeatConnection.quit()

        } catch (error) {

            console.error(
                "Unable to close heartbeat Redis connection:",
                error.message
            )
        }


        /*
        |--------------------------------------------------------------------------
        | Close BullMQ Worker
        |--------------------------------------------------------------------------
        */

        try {

            await worker.close()

        } catch (error) {

            console.error(
                "Unable to close worker:",
                error.message
            )
        }


        process.exit(0)
    }


    /*
    |--------------------------------------------------------------------------
    | Process Shutdown Events
    |--------------------------------------------------------------------------
    */

    process.on(
        "SIGINT",
        shutdown
    )

    process.on(
        "SIGTERM",
        shutdown
    )


    /*
    |--------------------------------------------------------------------------
    | Worker Started
    |--------------------------------------------------------------------------
    */

    console.log(
        "CV processing worker is running..."
    )
}


/*
|--------------------------------------------------------------------------
| Start Worker
|--------------------------------------------------------------------------
*/

startWorker()