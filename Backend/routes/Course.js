const express = require("express");
const router = express.Router();

const{createCourse,getAllCourses}=require("../controllers/Course");
const {auth, isAdmin} = require("../middlewares/auth");

router.post("/createCourse",auth,isAdmin,createCourse);

router.post("/getAllCourses",getAllCourses);

module.exports = router;