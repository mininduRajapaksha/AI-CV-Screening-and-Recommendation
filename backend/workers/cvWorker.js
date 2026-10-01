require("dotenv").config()

const { Worker } = require("bullmq")

const connectDB = require("../config/db")
const CV = require("../models/CV")
const Screening = require("../models/Screening")
const Job = require("../models/Job")

const { processCV } = require("../services/aiService")


const startWorker = async () => {

    await connectDB()

    console.log("MongoDB connection ready for worker")


    const worker = new Worker(
        "cv-processing",

        async (job) => {

            const { cvId, screeningId, jobId } = job.data

            console.log(`Processing CV: ${cvId}`)
            console.log(`Job ID: ${jobId}`)


            // ------------------------------------------------
            // 1. Find CV
            // ------------------------------------------------

            const cv = await CV.findById(cvId)

            if (!cv) {
                throw new Error("CV record not found")
            }


            // ------------------------------------------------
            // 2. Find Screening
            // ------------------------------------------------

            const screening = await Screening.findById(screeningId)

            if (!screening) {
                throw new Error("Screening record not found")
            }


            // ------------------------------------------------
            // 3. Find Job Posting
            // ------------------------------------------------

            const jobPosting = await Job.findById(jobId)

            if (!jobPosting) {
                throw new Error("Job posting not found")
            }


            console.log(`Job found: ${jobPosting.title}`)


            // ------------------------------------------------
            // 4. Update CV status
            // ------------------------------------------------

            cv.status = "processing"

            await cv.save()


            // ------------------------------------------------
            // 5. Build Job Description
            // ------------------------------------------------

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
                ${jobPosting.skills && jobPosting.skills.length > 0
                    ? jobPosting.skills.join(", ")
                    : "Not specified"}
                `


            console.log("Job description prepared.")


            // ------------------------------------------------
            // 6. Send CV + Job Description to AI Service
            // ------------------------------------------------

            console.log("Sending CV to AI service...")

            const aiResponse = await processCV(
                cv.filePath,
                jobDescription
            )


            console.log("AI Response:")
            console.log(JSON.stringify(aiResponse, null, 2))


            // ------------------------------------------------
            // 7. Check AI response
            // ------------------------------------------------

            if (!aiResponse || aiResponse.success === false) {

                throw new Error(
                    aiResponse?.error ||
                    "AI processing failed"
                )

            }


            // ------------------------------------------------
            // 8. Mark CV as complete
            // ------------------------------------------------

            cv.status = "complete"
            cv.errorMessage = null

            await cv.save()


            // ------------------------------------------------
            // 9. Update Screening progress
            // ------------------------------------------------

            screening.completedCVs += 1


            if (
                screening.completedCVs ===
                screening.totalCVs
            ) {

                screening.status = "complete"

            }


            await screening.save()


            console.log(`CV ${cvId} processed successfully.`)

        },


        // ------------------------------------------------
        // BullMQ Redis Connection
        // ------------------------------------------------

        {
            connection: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                username: process.env.REDIS_USERNAME,
                password: process.env.REDIS_PASSWORD
            }
        }

    )


    // ------------------------------------------------
    // Worker Events
    // ------------------------------------------------

    worker.on("completed", (job) => {

        console.log(
            `Job ${job.id} completed successfully.`
        )

    })


    worker.on("failed", (job, error) => {

        console.error(
            `Job ${job?.id} failed:`,
            error.message
        )

    })


    console.log("CV processing worker is running...")

}


startWorker()