const mongoose = require('mongoose');
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  cvFilePath: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, default: 'Pending' } // Pending, Processed
}, { timestamps: true });
module.exports = mongoose.model('Candidate', candidateSchema);
