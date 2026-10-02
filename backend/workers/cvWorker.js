require("dotenv").config()

const { Worker } = require("bullmq")
const connectDB = require("../config/db")

const CV = require("../models/CV")
const Screening = require("../models/Screening")
const Job = require("../models/Job")
const Candidate = require("../models/Candidate")

const { processCV } = require("../services/aiService")

const getFailureMessage = (error) => {
    const status = error.response?.status
    const rawMessage = String(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        ""
    ).toLowerCase()

    if (status === 429) {
        return "AI service rate limit reached. Please try again later."
    }

    if (rawMessage.includes("quota") || rawMessage.includes("token limit")) {
        return "AI service usage limit reached. Please try again later."
    }

    if (rawMessage.includes("busy") || rawMessage.includes("overloaded")) {
        return "AI service is busy. Please try again later."
    }

    if (status >= 500) {
        return "AI service is temporarily unavailable. Please try again later."
    }

    if (["ECONNREFUSED", "ETIMEDOUT", "ECONNABORTED"].includes(error.code)) {
        return "AI service is unavailable. Please try again later."
    }

    return error.message || "An unexpected error occurred while screening this CV."
}

const startWorker = async () => {

    await connectDB()

    console.log("MongoDB connection ready for worker")

    const worker = new Worker(
        "cv-processing",

        async (job) => {

            const {
                cvId,
                screeningId,
                jobId
            } = job.data

            console.log(`Processing CV: ${cvId}`)
            console.log(`Job ID: ${jobId}`)

            // Find CV
            const cv = await CV.findById(cvId)

            if (!cv) {
                throw new Error(
                    "CV record not found"
                )
            }

            
            // Find Screening
            const screening =
                await Screening.findById(
                    screeningId
                )

            if (!screening) {
                throw new Error(
                    "Screening record not found"
                )
            }

            if (screening.status === "cancelled") {
                cv.status = "cancelled"
                cv.errorMessage = null
                await cv.save()
                console.log(`Skipping cancelled screening: ${screeningId}`)
                return
            }

            
            // Find Job
            const jobPosting =
                await Job.findById(jobId)

            if (!jobPosting) {
                throw new Error(
                    "Job posting not found"
                )
            }

            console.log(
                `Job found: ${jobPosting.title}`
            )

            
            // Mark CV as processing
            cv.status = "processing"

            cv.errorMessage = null

            await cv.save()

            
            // Prepare Job Description

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

            
            // AI Processing
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

            
            // Check AI response
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

            // The AI request may still finish after a user cancels. Do not
            // persist its result if the screening was cancelled in the meantime.
            const currentScreening = await Screening.findById(screeningId)

            if (!currentScreening || currentScreening.status === "cancelled") {
                cv.status = "cancelled"
                cv.errorMessage = null
                await cv.save()
                console.log(`Discarding result for cancelled screening: ${screeningId}`)
                return
            }

            
            // Save Candidate
            const candidate =
                await Candidate.create({

                    jobId: jobId,

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

                    matchPercentage:
                        evaluation
                            .matchPercentage ||
                        0,

                    // Agent 03 fields
                    aiRecommendation:
                        "Pending",

                    justification:
                        "Awaiting Agent 03 evaluation",

                    // Agent 02 fields
                    matchedSkills:
                        evaluation
                            .matchedSkills ||
                        [],

                    missingSkills:
                        evaluation
                            .missingSkills ||
                        [],

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

            const screeningToUpdate = await Screening.findById(screeningId)

            if (!screeningToUpdate || screeningToUpdate.status === "cancelled") {
                cv.status = "cancelled"
                cv.errorMessage = null
                await cv.save()
                console.log(`Discarding result for cancelled screening: ${screeningId}`)
                return
            }

            
            // Mark CV complete
            cv.status = "complete"

            cv.errorMessage = null

            await cv.save()

            
            // Update Screening
            screeningToUpdate.completedCVs += 1

            const processedCVs =
                screeningToUpdate.completedCVs +
                screeningToUpdate.failedCVs

            if (
                processedCVs >=
                screeningToUpdate.totalCVs
            ) {
                screeningToUpdate.status =
                    "complete"
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
            connection: {
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
        }
    )

    
    // Job completed
    worker.on(
        "completed",
        (job) => {

            console.log(
                `Job ${job.id} completed successfully.`
            )
        }
    )

    
    // Job failed
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

                const failureMessage =
                    getFailureMessage(error)

                const screeningForFailure =
                    await Screening.findById(screeningId)

                if (!screeningForFailure || screeningForFailure.status === "cancelled") {
                    return
                }

                
                // Mark CV as failed
                const cv =
                    await CV.findById(
                        cvId
                    )

                if (cv) {

                    cv.status = "failed"

                    cv.errorMessage =
                        failureMessage

                    await cv.save()

                    console.log(
                        `CV ${cvId} marked as failed.`
                    )
                }

                
                // Update Screening
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

                if (screening.status === "cancelled") {
                    return
                }

                screening.failedCVs += 1
                screening.errors = screening.errors || []
                screening.errors.push({
                    cvId,
                    message: failureMessage
                })

                const processedCVs =
                    screening.completedCVs +
                    screening.failedCVs

                
                // Check if all CVs finished
                if (
                    processedCVs >=
                    screening.totalCVs
                ) {

                    screening.status =
                        screening.completedCVs > 0
                            ? "complete"
                            : "failed"
                }

                await screening.save()

                console.log(
                    `Screening progress: ${processedCVs}/${screening.totalCVs}`
                )

            } catch (updateError) {

                console.error(
                    "Error updating failed CV/screening:",
                    updateError
                )
            }
        }
    )

    console.log(
        "CV processing worker is running..."
    )
}

startWorker()
