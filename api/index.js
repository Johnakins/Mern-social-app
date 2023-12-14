// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const userRoute = require("./routes/users")
// const authRoute = require("./routes/auth")
// const postRoute = require("./routes/post")

import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import userRoute from "./routes/users.js"
import authRoute from "./routes/auth.js"
import postRoute from "./routes/post.js"


dotenv.config()
const app = express()

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to Mongodb')
}).catch((err) => {
    console.log(err)
})

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

app.listen(8000,()=>{
    console.log("Backend server is running!")
})