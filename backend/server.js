const express = require("express")
const cors = require("cors")

require("dotenv").config()

const connectDB = require("./config/db")
const cvRoutes = require("./routes/cvRoutes")
const screeningRoutes = require("./routes/screeningRoutes")

const app = express()

const PORT = process.env.PORT || 5000

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const candidateRoutes = require("./routes/candidateRoutes"); 
const adminRoutes = require("./routes/adminRoutes"); 

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/candidates", candidateRoutes); 
app.use("/api/admin", adminRoutes); 

//Database connection
connectDB()

app.use('/api/cvs', cvRoutes)
app.use('/api/screening', screeningRoutes)

//server start
app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`)
})