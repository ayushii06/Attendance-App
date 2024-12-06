const express = require("express");
const router = express.Router();

const {login, signUp,sendOTP,changePassword,getInstructor} = require("../controllers/Auth");
const{auth} = require("../middlewares/auth");

router.post("/login", login);
router.post("/signUp", signUp);

//protected route 

//testing route
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to protected route for test',
    })
})

router.post("/sendOTP",sendOTP);//auth dena hai ki nhi yaha *********
router.post("/changePassword",auth,changePassword);
router.post("/login", login);
router.get("/getInstructor",auth,getInstructor);
router.post("/signUp", signUp);


module.exports = router;