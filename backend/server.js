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

//Database connection
connectDB()

//server start
app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`)
})