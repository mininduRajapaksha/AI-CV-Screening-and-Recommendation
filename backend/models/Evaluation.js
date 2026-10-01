const mongoose = require('mongoose');
const evaluationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  matchPercentage: { type: Number, required: true },
  recommendationLevel: { type: String, enum: ['Highly Recommended', 'Recommended', 'Not Recommended'] },
  missingSkills: [{ type: String }],
  justification: { type: String },
  extractedData: { type: Object } // To store AI extracted JSON
}, { timestamps: true });
module.exports = mongoose.model('Evaluation', evaluationSchema);
