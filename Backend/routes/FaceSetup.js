const express = require("express");
const router = express.Router();

const {auth, isStudent} = require("../middlewares/auth");
const { enrollFace,verifyFace } = require("../controllers/FaceEnrollment");

router.post("/enrollFace",auth,isStudent,enrollFace);
router.post("/verifyFace",auth,isStudent,verifyFace);

module.exports = router;