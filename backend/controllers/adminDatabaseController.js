const mongoose = require("mongoose");

const getDatabaseStatus = async (req, res, next) => {
    try {
        const db = mongoose.connection;

        // Check MongoDB connection
        if (db.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: "Database is not connected"
            });
        }

        // Measure MongoDB response time
        const startTime = Date.now();

        await db.db.command({
            ping: 1
        });

        const responseTime = Date.now() - startTime;

        // Get database statistics
        const stats = await db.db.command({
            dbStats: 1
        });

        // Get collection information
        const collections = await db.db.listCollections().toArray();

        const collectionStats = await Promise.all(
            collections.map(async (collection) => {
                const collectionStats = await db.db.command({
                    collStats: collection.name
                });

                return {
                    name: collection.name,
                    documents: collectionStats.count || 0,
                    size: formatBytes(collectionStats.size || 0)
                };
            })
        );

        // Try to get connection information
        let activeConnections = null;
        let maxConnections = null;

        try {
            const serverStatus = await db.db.admin().command({
                serverStatus: 1
            });

            if (serverStatus.connections) {
                activeConnections = serverStatus.connections.current;
                maxConnections = serverStatus.connections.available;
            }
        } catch (error) {
            console.log(
                "Could not retrieve MongoDB connection statistics:",
                error.message
            );
        }

        // Get host information
        const host =
            db.host ||
            db.client?.s?.options?.srvHost ||
            "Unknown";

        res.status(200).json({
            success: true,

            database: {
                connectionStatus: "Connected",
                responseTime: `${responseTime} ms`,

                storage: {
                    usedBytes: stats.storageSize || 0,
                    used: formatBytes(stats.storageSize || 0),
                    dataSize: formatBytes(stats.dataSize || 0)
                },

                connections: {
                    current: activeConnections,
                    available: maxConnections
                },

                host,
                databaseName: db.name,
                driver: `Mongoose ${mongoose.version}`,

                collections: collectionStats
            }
        });

    } catch (error) {
        console.error("Database status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve database status",
            error: error.message
        });
    }
};


function formatBytes(bytes) {
    if (!bytes || bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
}


module.exports = {
    getDatabaseStatus
};