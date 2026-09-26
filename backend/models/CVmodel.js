const mongoose = require("mongoose")

const cvSchema = new mongoose.Schema({

    originalName: {
        type: String,
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    filePath: {
        type: String,
        required: true
    },

    fileSize: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "processing", "complete", "failed"],
        default: "pending"
    },

    errorMessage: {
        type: String,
        default: null
    }
    
}, {timestamps: true})

module.exports = mongoose.model("CV", cvSchema)