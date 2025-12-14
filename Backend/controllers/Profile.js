//hw how to apply a time gap or scheduling in deleting any account ot other things like your account is deleted after 5 days etc 
//chrone 
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req,res)=>{
    try{
        //get data 
        const {dateOfBirth=""/*it means default empty*/,about="",contactNumber,gender} = req.body;
        //get user id 
        const id = req.user.id;
        //validation 
        if(!contactNumber||!gender||!id){
            return res.status(400).json({
                success:false,
                message:'Fill All Details for Profile',
            });
        }
        //find profile 
        //profile ke id nhi hai but user ki id hai aur user ke andr profile ki id hai 
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile 
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:'Profile created Successfully'
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while creating Profile',
        })
    }
}

//delete account 
exports.deleteAccount = async(req,res)=>{
    try{
        //get id 
        const id = req.user.id;//id nikal li kyonki logged in thi 
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found',
            })
        }
        //phle profile delete ki 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // ..hw*****unenroll user from all enrolled courses

        //delete user 
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:'Account Deleted Successfully'
        })
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while deleting Account'
        })
    }
}

// get own details
//anyone can access
exports.getAllUserDetails = async(req,res)=>{
    try{
        //get id
        const id = req.user.id;
        //validate and get user details 
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:'User Data fetched Successfully',
            userDetails,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while fetching User Details'
        })
    }
}

exports.getEnrolledCourses = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
exports.updateDisplayPicture = async(req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//all courses and branches taught by this instructor
exports.instructorDashboard = async (req, res) => {
    try {
        // Fetch all courses taught by the instructor
        const courseDetails = await Course.find({ instructor: req.user.id }).populate({
            path: "branch",
            select: "name", 
        });

        // Map through the courses to gather data
        const courseData = courseDetails.map((course) => {
            const branchNames = course.branch.map((branch) => branch.name); // Extract branch names

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalBranchesEnrolled: course.branch.length,
                branches: branchNames, // List of branch names
            };
            return courseDataWithStats;
        });

        // Respond with data
        res.status(200).json({
            success: true,
            message: "Course Data Stats Fetched Successfully",
            courses: courseData,
        });
    }
    catch (error) {
        console.error("Error in Instructor Dashboard:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error in Instructor Dashboard",
            error: error.message,
        });
    }
};