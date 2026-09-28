// Import the Candidate model to interact with the MongoDB database
const Candidate = require('../models/Candidate');

// GET: Fetch candidates by specific Job ID
exports.getCandidatesByJob = async (req, res) => {
    try {
        // Find all candidates associated with the given jobId in the database
        const candidates = await Candidate.find({ jobId: req.params.jobId });
        
        res.status(200).json({
            success: true,
            data: candidates
        });
    } catch (error) {
        // Return a 500 server error if the database query fails
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET: Fetch Specific Candidate Details by ID
exports.getCandidateDetails = async (req, res) => {
    try {
        // Find a specific candidate by their unique MongoDB document ID (_id)
        const candidate = await Candidate.findById(req.params.id);
        
        // If no candidate is found with the provided ID, return a 404 error
        if (!candidate) {
            return res.status(404).json({ success: false, error: 'Candidate not found' });
        }

        // Return the full candidate profile details fetched from the database
        res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        // Return a 500 server error if the database query fails
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST: Save a new candidate evaluated by the AI Microservice
exports.saveCandidate = async (req, res) => {
    try {
        // Map the incoming JSON data from the Python AI script to the Candidate model structure
        const newCandidate = new Candidate({
            jobId: req.body.jobId || "1", // Defaulting to "1" for current testing purposes
            personalInfo: {
                name: req.body["Candidate Name"] || req.body.personalInfo?.name || "Unknown Candidate",
                email: req.body["Contact Info"]?.email || req.body.personalInfo?.email || "N/A",
                phone: req.body["Contact Info"]?.phone || req.body.personalInfo?.phone || "N/A"
            },
            matchPercentage: req.body.matchPercentage || 0,
            aiRecommendation: req.body.aiRecommendation || "Pending",
            justification: req.body.justification || "Awaiting AI Justification",
            matchedSkills: req.body.matchedSkills || [],
            missingSkills: req.body.missingSkills || [],
            // Handle variations in key casing from the AI output
            experience: req.body.Experience || req.body.experience || [],
            education: req.body.Education || req.body.education || []
        });

        // Save the newly created candidate record into the MongoDB database
        const savedCandidate = await newCandidate.save();

        // Return a success response with the saved data
        res.status(201).json({
            success: true,
            message: "Candidate data saved successfully to MongoDB",
            data: savedCandidate
        });
    } catch (error) {
        // Return a 500 server error if saving to the database fails
        res.status(500).json({ success: false, error: error.message });
    }
};