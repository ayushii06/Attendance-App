const Course = require("../models/Course");
const Branch = require("../models/Branch");
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
            branch: branchDetails,
        });

        // Add the course to the instructor's course list
        await User.findByIdAndUpdate(
            instructor,
            { $addToSet: { courses: newCourse._id } }, // Add course reference to the set
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
        // Update the `courses` array for students in the branches
        await Promise.all(
            branchDetails.map(async (branchId) => {
                const branch = await Branch.findById(branchId).populate("student");
                await Promise.all(
                    branch.student.map(async (studentId) => {
                        await User.findByIdAndUpdate(
                            studentId,
                            { $addToSet: { courses: newCourse._id } }, // Avoid duplicate entries
                            { new: true }
                        );
                    })
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
exports.getAllCourses = async (req, res) => {
    try {
        // Extract branch ID from request body
        const { branchId } = req.body;

        // Fetch branch details and populate only courses
        const branchDetails = await Branch.findById(branchId)
            .select("name year courses") // Select only specific fields
            .populate({
                path: "courses",
                select: "courseName year courseDescription branch instructor lectures", // Populate specific course fields
                populate:{
                    path:"instructor",
                    select:"firstName lastName",
                }
            })
            .exec();

        // Check if the branch exists
        if (!branchDetails) {
            return res.status(404).json({
                success: false,
                message: "Branch not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Branch courses fetched successfully.",
            branch: {
                branchName: branchDetails.name,
                year: branchDetails.year,
                courses: branchDetails.courses,
            },
        });
    } catch (error) {
        console.error("Error fetching branch courses:", error);
        return res.status(500).json({
            success: false,
            message: "Error while getting branch courses.",
        });
    }
}