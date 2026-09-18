const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

require("dotenv").config()

const app = express()

const PORT = process.env.PORT || 5000

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const candidateRoutes = require("./routes/candidateRoutes"); 

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/candidates", candidateRoutes); 

//Database connection
connectDB()

//server start
app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`)
})