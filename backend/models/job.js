const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  salaryRange: { type: String },
  description: { type: String, required: true },
  skills: [{ type: String }],
  status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Job', jobSchema);