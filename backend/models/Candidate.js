const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  jobId: { 
    type: String, 
    required: true,
    default: "1" 
  },
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String }
  },
  matchPercentage: { type: Number, required: true },
  aiRecommendation: { type: String, required: true },
  justification: { type: String },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  experience: [{
    title: { type: String },
    duration: { type: String },
    company: { type: String }
  }],
  education: [{
    degree: { type: String },
    institution: { type: String }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
