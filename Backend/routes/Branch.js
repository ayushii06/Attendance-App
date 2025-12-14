const express = require("express");
const router = express.Router();

const {auth, isAdmin} = require("../middlewares/auth");
const { createBranch, showAllBranch, showBranchDetails } = require("../controllers/Branch");

router.post("/createBranch",auth,isAdmin,createBranch);

// router.post("/showAllBranch",auth,showAllBranch);
router.post("/showAllBranch",showAllBranch);
router.post("/showBranchDetails",auth,showBranchDetails);

module.exports = router;