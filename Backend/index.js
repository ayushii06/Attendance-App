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

const PORT = process.env.PORT;

database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:5174",
        credentials:true,
    })
)
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