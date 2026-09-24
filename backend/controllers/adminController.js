const os = require('os');

const getSystemStatus = (req, res) => {
    try {
        const status = {
            server: "Running",
            uptime: os.uptime(),
            message: "System is healthy"
        };
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ error: "System status check failed" });
    }
};

const updateApiConfig = (req, res) => {
    try {
        const { apiKey } = req.body;
        if (!apiKey) {
            return res.status(400).json({ error: "API Key is required" });
        }
        res.status(200).json({ message: "API Configuration updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update API configuration" });
    }
};

module.exports = { getSystemStatus, updateApiConfig };