// Get Statistics for Dashboard Cards
exports.getDashboardStats = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                totalJobs: 12,
                totalCandidates: 45,
                processingCount: 3
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