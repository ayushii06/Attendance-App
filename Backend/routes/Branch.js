const express = require("express");
const router = express.Router();

const {auth, isAdmin} = require("../middlewares/auth");
const { createBranch, showAllBranch, showBranchDetails } = require("../controllers/Branch");

router.post("/createBranch",auth,isAdmin,createBranch);

router.get("/showAllBranch",auth,showAllBranch);
router.get("/showBranchDetails",auth,showBranchDetails);

module.exports = router;