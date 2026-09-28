require("dotenv").config()

const { Worker } = require("bullmq")
const connectDB = require("../config/db")
const CV = require("../models/CV")
const Screening = require("../models/Screening")
const { processCV } = require("../services/aiService")

const startWorker = async () => {

    // Connect to MongoDB
    await connectDB()

    console.log("MongoDB connection ready for worker")

    const worker = new Worker(
        "cv-processing",
        async (job) => {

            console.log(`Processing CV job: ${job.id}`)

            const { cvId, screeningId, jobId } = job.data

            console.log(`CV ID: ${cvId}`)
            console.log(`Screening ID: ${screeningId}`)
            console.log(`Job ID: ${jobId}`)

            const cv = await CV.findById(cvId)

            if (!cv) {
                throw new Error("CV record not found")
            }

            const screening = await Screening.findById(screeningId)

            if (!screening) {
                throw new Error("Screening record not found")
            }

            // Mark CV as processing
            cv.status = "processing"
            await cv.save()

            console.log(`CV ${cv.originalName} is processing...`)

            // Temporary Job Description
            const jobDescription = `
            We are looking for a Frontend Developer.

            Requirements:
            - React
            - JavaScript
            - HTML
            - CSS
            - REST APIs
            - Git
            - Good problem-solving skills
            `


            // Send CV to FastAPI
            console.log(`Sending ${cv.originalName} to AI service...`)

            const aiResponse = await processCV(
                cv.filePath,
                jobDescription
            )

            console.log("AI service response:")
            console.log(aiResponse)

            // Mark CV as complete
            cv.status = "complete"
            cv.errorMessage = null
            await cv.save()

            // Update screening progress
            screening.completedCVs += 1

            if (screening.completedCVs === screening.totalCVs) {
                screening.status = "complete"
            }

            await screening.save()

            console.log(`CV ${cv.originalName} completed`)
            console.log(
                `Screening progress: ${screening.completedCVs}/${screening.totalCVs}`
            )
        },
        {
            connection: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                username: process.env.REDIS_USERNAME,
                password: process.env.REDIS_PASSWORD
            }
        }
    )

    worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed`)
    })

    worker.on("failed", (job, error) => {
        console.error(`Job ${job?.id} failed: ${error.message}`)
    })

    console.log("CV processing worker is running...")
}

startWorker()