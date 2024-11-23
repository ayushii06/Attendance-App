const express = require("express");
const router = express.Router();

const {auth, isAdmin, isInstructor, isStudent} = require("../middlewares/auth");
const { startAttendance, markAttendance, stopAttendance, getCourseAttendance, getStudentAttendanceByCourse } = require("../controllers/Attendance");

router.post("/startAttendance",auth,isInstructor,startAttendance);
router.post("/stopAttendance",auth,isInstructor,stopAttendance);
router.post("/markAttendance",auth,isStudent,markAttendance);
router.post("/getCourseAttendance",auth,isAdmin,isInstructor,getCourseAttendance);
router.post("/getStudentAttendanceByCourse",auth,isStudent,getStudentAttendanceByCourse);

module.exports = router;