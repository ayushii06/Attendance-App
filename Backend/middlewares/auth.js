const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req,res,next)=>{
    try{
        console.log("here middleware token",req.cookies.token || req.header("Authorization").replace("Bearer ","") || req.body.token);
        //extract token 
        let token;
        if(req.header("Authorization")){
            token = req.header("Authorization").replace("Bearer ","");
        }
        else if(req.body.token){
            token = req.body.token;
        }
        else if(req.cookies.token){
            token = req.cookies.token;
        }
        else{
            token = null;
        }
        console.log("token",token);
        //if token is not present 
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }
        //verify token 
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log("decode",decode);
            req.user = decode
        }
        catch(error){
            //verification issue 
            return res.status(401).json({
                success:false,
                message:'Token is Invalid',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong in validating token',
        })
    }
}
 //is Student 
 exports.isStudent = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is portal for student',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified',
        });
    }
 }
 exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is portal for instructor',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified',
        });
    }
 }

 //isAdmin 
 exports.isAdmin = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is portal for admin',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified',
        });
    }
 }

