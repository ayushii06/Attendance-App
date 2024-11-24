const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const Branch = require("../models/Branch");

//send otp
exports.sendOTP = async (req,res)=>{
    try{
        //fetch email 
        const {email} = req.body;
        //check if user already exist 
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already Exist',
            })
        }
        //generate otp 
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload = {email,otp};
        //create entry for otp 
        const otpBody = await OTP.create(otpPayload);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otpBody,
        })
    }
    catch(error){
        res.status(200).json({
            success:false,
            message:'Error while sending otp',
        })
    }
}

//signup 
exports.signUp = async (req, res) => {
    try {
        // Data fetch
        const {
            email, password, confirmPassword, firstName, lastName,
            accountType, otp, rollNo, year, branch
        } = req.body;

        // Check if all fields are filled
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are not filled",
            });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match.',
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: 'User Already exists',
            });
        }

        // Validate OTP
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found',
            });
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Fetch branch and associated courses
        let branchDetails = null;
        if(accountType === "Student"){

            branchDetails = await Branch.findOne({ name: branch,year:year});
            if (!branchDetails) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid branch',
                });
            }
            // Extract course references
            // const courses = branchDetails.courses.map(course => course._id);
        }

        // Create profile details
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Save user entry in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebar.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            rollNo:accountType==="Student"?rollNo:null,
            year:accountType==="Student"?year:null,
            branch:accountType==="Student"?branchDetails._id:null,
            courses:accountType==="Student"?branchDetails.courses:[], // Add courses as references
        });
        
         // Add student to the branch's student array
        if(accountType==="Student"){
            branchDetails.student.push(user._id);
            await branchDetails.save();
        }

        return res.status(200).json({
            success: true,
            message: 'User Registered Successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Error while signing up',
        });
    }
};

//login 
exports.login = async (req,res)=>{
    try{
        //get data from req.body 
        const {email,password} = req.body;
        //validation of data
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:'Fill all the entries in login',
            });
        }
        //fetch user details by email 
        let user = await User.findOne({email}).populate("additionalDetails");
        // if user doesn't exist
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User Not Exist. Try Signup',
            });
        }
        //check password and generate jwt
        const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            //create cookie 
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in Successfully',
            })
        }
        else{
            //incorrect password 
            return res.status(401).json({
                success:false,
                message:'Incorrect Password',
            })
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Error while login',
        })
    }
}

//change password

exports.changePassword = async(req,res)=>{
    try{}
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to change password',
        })
    }
}