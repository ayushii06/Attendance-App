const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const Branch = require("../models/Branch");

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Generate a unique OTP
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        let existingOTP = await OTP.findOne({ otp });

        // Ensure uniqueness of the OTP
        while (existingOTP) {
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            existingOTP = await OTP.findOne({ otp });
        }

        // Check if the email has an active OTP (avoid spamming)
        const activeOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (activeOTP) {
            const timeSinceLastOTP = (Date.now() - new Date(activeOTP.createdAt).getTime()) / 1000;
            if (timeSinceLastOTP < 60) {
                return res.status(429).json({ success: false, message: "Wait 1 minute before requesting another OTP" });
            }
        }

        const otpPayload = {email,otp};
        //create entry for otp 
        await OTP.create(otpPayload);

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: "Error sending OTP" });
    }
};

//signup
exports.signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName, accountType, otp, rollNo, year, branch } = req.body;

        // Validate inputs
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate OTP
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!recentOtp || recentOtp.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Process branch details for students
        let branchDetails = null;
        if (accountType === "Student") {
            branchDetails = await Branch.findOne({ name: branch, year });
            if (!branchDetails) {
                return res.status(400).json({ success: false, message: "Invalid branch" });
            }
        }

        // Create user profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create user record
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            rollNo: accountType === "Student" ? rollNo : null,
            year: accountType === "Student" ? year : null,
            branch: accountType === "Student" ? branchDetails._id : null,
            courses: accountType === "Student" ? branchDetails.courses : [],
        });

        // Link user to branch
        if (accountType === "Student") {
            branchDetails.student.push(user._id);
            await branchDetails.save();
        }

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Error signing up user" });
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

exports.getInstructor = async(req,res)=>{
    try{
        const instructor = await User.find({accountType:'Instructor'}).select('firstName lastName courses').populate(
            {
            path:'courses',
            select:'courseName branch',
            populate:
            {
                path:'branch',
                select:'name',
            }
        }

        );
        return res.status(200).json({
            success:true,
            message:'Instructor fetched successfully',
            instructor,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while getting Instructor',
        })
    }
}