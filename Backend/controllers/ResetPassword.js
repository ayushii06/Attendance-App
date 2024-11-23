const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset password Token 
exports.resetPasswordToken = async (req,res)=>{
    try{
        //get email 
        const email = req.body.email;
        //check user for this email 
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:'Your Email is not registered',
            });
        }
        //generate token 
        const token = crypto.randomUUID();
        //update user by adding token and expiration time 
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true}//return updated doc 
        );
        //create url of frontend as in email the frontend link will be send 
        const url = `http://localhost:3000/update-password/${token}`
        //sending mail
        await mailSender(email,"Password Reset Link",`Reset password: ${url}`);
        return res.json({
            success:true,
            message:'Email sent Successffully, Check email and Reset Password',
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password link to mail',
        })
    }
}

//reset password 
exports.resetPassword = async (req,res)=>{
    try{
        //fetch details 
        const {password,confirmPassword,token} = req.body;
        //note: token ko body me frontend ne bheja hai taaki hum identify kr paae kon sa user tha 

        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:'Password not matching',
            });
        }
        //get user detail from db 
        const userDetails = await User.findOne({token:token});
        //if no entry for the given token 
        if(!userDetails){
            return res.json({
                success:false,
                message:'No user found - Invalid Token',
            });
        }
        //token time expires 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:'Token is Expired',
            });
        }
        //sab kuch sahi hai 
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        //password update in db 
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response 
        return res.status(200).json({
            success:true,
            message:'Password reset Successfully',
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while resetting password',
        })
    }
}