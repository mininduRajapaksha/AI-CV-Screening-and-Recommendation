// Import required models to interact with the MongoDB database
const Candidate = require('../models/Candidate');
const Job = require('../models/Job'); 

// GET: Fetch all candidates across all jobs and dynamically attach their real Job Titles
exports.getAllCandidates = async (req, res) => {
    try {
        // Retrieve every candidate document from MongoDB
        const candidates = await Candidate.find();
        
        // Map through each candidate to find their associated Job Title using the jobId
        const candidatesWithJobTitles = await Promise.all(candidates.map(async (candidate) => {
            let jobTitle = "N/A";
            try {
                // Look up the actual job document using the candidate's jobId as a foreign key
                const job = await Job.findById(candidate.jobId);
                if (job && job.title) {
                    jobTitle = job.title; // Extract the title from the Job model
                }
            } catch (err) {
                // Silently ignore casting errors if jobId is not a valid ObjectId yet
            }
            
            return {
                ...candidate._doc, // Convert Mongoose document to a plain JavaScript object
                jobTitle: jobTitle // Attach the dynamically fetched job title
            };
        }));

        res.status(200).json({ success: true, data: candidatesWithJobTitles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET: Fetch candidates filtered by a specific Job ID
exports.getCandidatesByJob = async (req, res) => {
    try {
        // Find all candidates associated with the given jobId
        const candidates = await Candidate.find({ jobId: req.params.jobId });
        
        // Map through each candidate to attach the Job Title for the filtered list
        const candidatesWithJobTitles = await Promise.all(candidates.map(async (candidate) => {
            let jobTitle = "N/A";
            try {
                const job = await Job.findById(candidate.jobId);
                if (job && job.title) {
                    jobTitle = job.title;
                }
            } catch (err) {}
            
            return {
                ...candidate._doc,
                jobTitle: jobTitle
            };
        }));

        res.status(200).json({
            success: true,
            data: candidatesWithJobTitles
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET: Fetch full profile details of a specific candidate by their MongoDB ID
exports.getCandidateDetails = async (req, res) => {
    try {
        // Find a specific candidate by their unique MongoDB document ID (_id)
        const candidate = await Candidate.findById(req.params.id);
        
        if (!candidate) {
            return res.status(404).json({ success: false, error: 'Candidate not found' });
        }

        let jobTitle = "N/A";
        try {
            // Fetch the real job title from the Job collection
            const job = await Job.findById(candidate.jobId);
            if (job && job.title) {
                jobTitle = job.title;
            }
        } catch (err) {}

        // Return the full candidate profile alongside the dynamic job title
        res.status(200).json({
            success: true,
            data: {
                ...candidate._doc,
                jobTitle: jobTitle
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST: Save a new candidate evaluated by the AI Microservice
exports.saveCandidate = async (req, res) => {
    try {
        // Map the incoming JSON data from the Python AI script to the Candidate model structure
        const newCandidate = new Candidate({
            jobId: req.body.jobId || "1", // Foreign key linking to the Job collection
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
        res.status(500).json({ success: false, error: error.message });
    }
};