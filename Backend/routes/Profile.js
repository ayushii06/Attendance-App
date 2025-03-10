const express = require("express");
const router = express.Router();

const {updateProfile,getAllUserDetails,deleteAccount,getEnrolledCourses,updateDisplayPicture, instructorDashboard} = require("../controllers/Profile");
const{auth, isInstructor} = require("../middlewares/auth");

// router.delete("/deleteProfile", deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getUserDetails",auth,getAllUserDetails);
router.get("/getEnrolledCourses",auth,getEnrolledCourses);
router.get("/instructorDashboard",auth,isInstructor,instructorDashboard);
// router.put("/updateDisplayPicture",auth,updateDisplayPicture);


module.exports = router;