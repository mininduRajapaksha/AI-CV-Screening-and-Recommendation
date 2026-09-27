// Import the Candidate model to interact with the MongoDB database
const Candidate = require('../models/Candidate');

// Get Statistics for Dashboard Cards
exports.getDashboardStats = async (req, res) => {
    try {
        // Fetch real total candidates count from the database
        const totalCandidatesCount = await Candidate.countDocuments();
        
        // Fetch shortlisted candidates count (Filtering 'Highly Recommended' and 'Recommended')
        const shortlistedCount = await Candidate.countDocuments({
            aiRecommendation: { $in: ["Highly Recommended", "Recommended"] }
        });

        res.status(200).json({
            success: true,
            data: {
                totalJobs: 12, // Keeping this hardcoded until Job models are implemented by the team
                totalCandidates: totalCandidatesCount, // Dynamically fetched real data
                shortlistedCount: shortlistedCount,    // Dynamically fetched real data
                processingCount: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Get Recent Jobs for Dashboard
exports.getRecentJobs = async (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            data: [
                { title: 'Software Engineer', department: 'Engineering', status: 'Active' },
                { title: 'UX Designer', department: 'Design', status: 'Active' }
            ] 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};