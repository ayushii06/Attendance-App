const express = require("express");
const app = express();


const userRoutes = require("./routes/User");
const branchRoutes = require("./routes/Branch");
const courseRoutes = require("./routes/Course");
const attendanceRoutes = require("./routes/Attendance");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

database.connect();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: [
      "https://attendance-app-roan.vercel.app", // Frontend on Vercel
      "http://localhost:5173", // Optional: Local Development
      "*", // Allow all origins (if needed temporarily for debugging)
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS", // Important for preflight requests
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "headers", // Fix for headers issue
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
    ],
    exposedHeaders: ["Authorization", "Content-Length", "X-Kuma-Revision"], // Optional, if needed
    credentials: true, // Allow credentials (cookies, etc.)
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };


app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

cloudinaryConnect();


app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/branch" , branchRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/attendance" , attendanceRoutes);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:'Your server is up and running',
    })
});

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
});