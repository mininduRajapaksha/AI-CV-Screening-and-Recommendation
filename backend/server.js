const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cvRoutes = require("./routes/cvRoutes");
const screeningRoutes = require("./routes/screeningRoutes");
const adminDatabaseRoutes = require("./routes/adminDatabaseRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const profileRoutes = require("./routes/profileRoutes")

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// User Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/screening", screeningRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

//admin
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminDatabaseRoutes);
app.use("/api/admin", adminUserRoutes);

app.use("/api/profile", profileRoutes);

// Return JSON for route and validation failures so API clients never receive
// Express's default HTML error page.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// Database Connection
connectDB();


app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
