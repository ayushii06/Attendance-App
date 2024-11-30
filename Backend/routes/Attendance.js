const express = require("express");
const router = express.Router();

const {auth, isInstructor, isStudent} = require("../middlewares/auth");
const { startAttendance,getLectureDatesByCourse, markAttendance, stopAttendance, getCourseAttendance, getStudentAttendanceByCourse, updateAttendanceExpiration } = require("../controllers/Attendance");

router.post("/startAttendance",auth,isInstructor,startAttendance);
router.put("/updateAttendanceExpiration",auth,isInstructor,updateAttendanceExpiration);
router.post("/stopAttendance",auth,isInstructor,stopAttendance);
router.post("/markAttendance",auth,isStudent,markAttendance);
router.post("/getCourseAttendance",auth,isInstructor,getCourseAttendance);
router.post("/getStudentAttendanceByCourse",auth,isStudent,getStudentAttendanceByCourse);
router.post("/getLectureDatesByCourse",auth,isInstructor,getLectureDatesByCourse);
router.post("/getLectureDatesByCourseForStudent",auth,isStudent,getLectureDatesByCourse);

module.exports = router;