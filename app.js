const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser  = require("cookie-parser")
const userRoutes = require("./routes/user.routes")

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/users" , userRoutes)


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong",
        file : req.file || "No files..."
    })
})

module.exports = {app}