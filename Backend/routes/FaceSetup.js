const express = require("express");
const router = express.Router();

const {auth, isAdmin} = require("../middlewares/auth");
const { enrollFace } = require("../controllers/FaceEnrollment");

router.post("/enrollFace",auth,enrollFace);

module.exports = router;