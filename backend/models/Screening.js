const mongoose = require("mongoose")

const screeningSchema = new mongoose.Schema({

    jobId: {
        type: String,
        required: true
    },

    cvIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CV"
    }],

    totalCVs: {
        type: Number,
        required: true
    },

    completedCVs: {
        type: Number,
        default: 0
    },

    failedCVs: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["pending", "processing", "complete", "failed"],
        default: "pending"
    }

}, { timestamps: true })

module.exports = mongoose.model("Screening", screeningSchema)