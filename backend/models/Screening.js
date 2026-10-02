const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            required: true
        },

        // User who started this screening
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        cvIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CV"
            }
        ],

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

        errors: [
            {
                cvId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CV"
                },
                message: {
                    type: String,
                    required: true
                }
            }
        ],

        status: {
            type: String,
            enum: ["pending", "processing", "complete", "failed", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Screening", screeningSchema);
