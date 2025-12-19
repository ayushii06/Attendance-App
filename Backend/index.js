// index.js
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const branchRoutes = require("./routes/Branch");
const courseRoutes = require("./routes/Course");
const attendanceRoutes = require("./routes/Attendance");
const faceRoutes = require("./routes/FaceSetup");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { loadModels } = require('./face-api-setup');

const PORT = process.env.PORT || 5000;

database.connect();

app.use(cookieParser());

// 1. Correct CORS Configuration
const corsOptions = {
    origin: "https://attendance-app-olive.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 2. Correct Middleware Ordering: Body parsers first
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. File upload after body parsers
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

cloudinaryConnect();

// 4. Routes after all middleware
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/branch", branchRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/face", faceRoutes);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running',
    });
});



app.listen(PORT, async() => {
    await loadModels();
    console.log(`App is listening at ${PORT}`);
});