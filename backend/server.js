const express = require("express")
const cors = require("cors")

require("dotenv").config()

const connectDB = require("./config/db")
const cvRoutes = require("./routes/cvRoutes")

const app = express()

const PORT = process.env.PORT || 5000

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Database connection
connectDB()

app.use('/api/cvs', cvRoutes)

//server start
app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`)
})