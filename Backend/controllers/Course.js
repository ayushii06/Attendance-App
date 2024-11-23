const Course = require("../models/Course");
const Branch = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
    try {
        // Extract data from request
        const { courseName, courseDescription, whatYouWillLearn, branch, year, instructor, lectures } = req.body;

        // Validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !branch || !year || !instructor || !lectures) {
            return res.status(400).json({
                success: false,
                message: "Fill all course details",
            });
        }

        // Validate branches and fetch their details
        const branchDetails = await Promise.all(
            branch.map(async (branchId) => {
                const branchDetail = await Branch.findById(branchId);
                if (!branchDetail) {
                    throw new Error(`Branch with ID ${branchId} not found`);
                }
                return branchDetail._id;
            })
        );

        // Create a new course in the database
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor,
            whatYouWillLearn,
            year,
            lectures,
            Branch: branchDetails,
        });

        // Add the course to the instructor's course list
        await User.findByIdAndUpdate(
            instructor,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        // Add the course to each branch
        await Promise.all(
            branchDetails.map(async (branchId) => {
                await Branch.findByIdAndUpdate(
                    branchId,
                    { $push: { courses: newCourse._id } },
                    { new: true }
                );
            })
        );

        // Response
        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        });
    } catch (error) {
        console.error("Error while creating course:", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating Course",
            error: error.message,
        });
    }
};

//get all courses of a branch
exports.getAllCourses = async (req,res)=>{
    try{
        const {branch,year} = req.body;
        const allCourses = await Branch.find({name:branch,year:year}).populate({
            path:"courses",
            select:"courseName instructor lectures",
        }).exec();
        return res.status(200).json({
            success:true,
            message:'All courses fetched Successfully',
            allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot fetch Courses',
            error:error.message,
        })
    }
};
