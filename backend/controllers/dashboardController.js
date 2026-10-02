// Import the Candidate model to interact with the MongoDB database
const Candidate = require('../models/Candidate');

// Get Statistics for Dashboard Cards & Charts
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Stats (Top Cards)
        const totalCandidatesCount = await Candidate.countDocuments();
        
        const shortlistedCount = await Candidate.countDocuments({
            aiRecommendation: { $in: ["Highly Recommended", "Recommended"] }
        });

        // 2. Dynamic Skills Distribution for Pie Chart
        // MongoDB Aggregation to count the most common matched skills
        const rawSkills = await Candidate.aggregate([
            { $unwind: "$matchedSkills" }, // Deconstruct the matchedSkills array into individual documents
            { $group: { _id: "$matchedSkills", count: { $sum: 1 } } }, // Group by skill name and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order (highest first)
            { $limit: 5 } // Limit the results to the top 5 most common skills
        ]);

        const colors = ['#1e3a8a', '#4f46e5', '#3b82f6', '#0ea5e9', '#38bdf8'];
        const totalSkillsCount = rawSkills.reduce((acc, curr) => acc + curr.count, 0);

        // Calculate the percentage and assign predefined colors for the Frontend Pie Chart
        const skillsDistribution = rawSkills.map((skill, index) => ({
            name: skill._id,
            value: totalSkillsCount > 0 ? Math.round((skill.count / totalSkillsCount) * 100) : 0,
            color: colors[index % colors.length]
        }));

        // 3. Dynamic Job Statistics for Bar Chart (Monthly Data)
        const monthlyData = await Candidate.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group candidates by the month of their creation date
                    Applications: { $sum: 1 }, // Count total applications for the month
                    // Calculate pseudo-hires by counting 'Highly Recommended' candidates
                    Hires: {
                        $sum: { $cond: [{ $eq: ["$aiRecommendation", "Highly Recommended"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id": 1 } } // Sort chronologically from January to December
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const jobStats = monthlyData.map(item => ({
            name: monthNames[item._id - 1],
            Applications: item.Applications,
            Hires: item.Hires
        }));

        // Provide fallback data for the current month if the database has no candidate records yet
        const finalJobStats = jobStats.length > 0 ? jobStats : [
            { name: monthNames[new Date().getMonth()], Applications: 0, Hires: 0 }
        ];

        // Send the compiled statistics to the frontend
        res.status(200).json({
            success: true,
            data: {
                totalJobs: 12, // Keeping this hardcoded until Job models are implemented by the team
                totalCandidates: totalCandidatesCount,
                shortlistedCount: shortlistedCount,
                processingCount: 0,
                jobStats: finalJobStats,
                skillsDistribution: skillsDistribution
            }
        });
    } catch (error) {
        console.error("Error generating dashboard stats:", error);
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