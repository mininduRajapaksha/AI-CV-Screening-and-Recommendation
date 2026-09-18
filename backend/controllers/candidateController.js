// Get candidates by specific Job ID (Ranked by match percentage)
exports.getCandidatesByJob = async (req, res) => {
    try {
        // Dummy data for candidates list
        res.status(200).json({
            success: true,
            data: [
                { id: "C001", name: "Kasun Perera", matchPercentage: 92, aiRecommendation: "Highly Recommended" },
                { id: "C002", name: "Amal Silva", matchPercentage: 78, aiRecommendation: "Recommended" },
                { id: "C003", name: "Nimali Fernando", matchPercentage: 45, aiRecommendation: "Not Recommended" }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Specific Candidate Details (Including Missing Skills & Recommendations)
exports.getCandidateDetails = async (req, res) => {
    try {
        // Dummy data for a single candidate's full profile
        res.status(200).json({
            success: true,
            data: {
                candidateId: req.params.id,
                personalInfo: { 
                    name: "Kasun Perera", 
                    email: "kasun@example.com",
                    phone: "0712345678"
                },
                matchPercentage: 92,
                missingSkills: ["Docker", "Kubernetes", "GraphQL"],
                aiRecommendation: "Highly Recommended",
                justification: "Candidate has strong experience in React and Node.js matching the core requirements."
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};