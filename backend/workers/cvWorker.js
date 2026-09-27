require("dotenv").config()

const { Worker } = require("bullmq")
const connectDB = require("../config/db")
const CV = require("../models/CV")

const startWorker = async () => {

    // Connect to MongoDB first
    await connectDB()

    console.log("MongoDB connection ready for worker")

    const worker = new Worker(
        "cv-processing",
        async (job) => {

            console.log(`Processing CV job: ${job.id}`)

            const { cvId } = job.data

            const cv = await CV.findById(cvId)

            if (!cv) {
                throw new Error("CV record not found")
            }

            cv.status = "processing"
            await cv.save()

            console.log(`CV ${cv.originalName} is processing...`)

            // AI processing will be added later
            await new Promise((resolve) => setTimeout(resolve, 3000))

            cv.status = "complete"
            cv.errorMessage = null
            await cv.save()

            console.log(`CV ${cv.originalName} completed`)
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