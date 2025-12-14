const Branch = require("../models/Branch");

//create Branch

//CHANGE NO 1
exports.createBranch = async (req, res) => {
    try {
        // Fetch data: name, description, and the new 'curriculum' array
        const { name, description, curriculum } = req.body;
        console.log(name,description,curriculum)

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Branch name and description are required',
            });
        }
        
        // Create entry in db
        const branchDetails = await Branch.create({
            name: name,
            description: description,
            curriculum: curriculum, // Save the curriculum array
        });

        return res.status(200).json({
            success: true,
            message: 'Branch created Successfully',
            branchDetails: branchDetails
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while creating branch',
        });
    }
};

// exports.createBranch = async (req,res)=>{
//     try{
//         //fetch data 
//         const {name,description,year} = req.body;
//         //validation 
//         if(!name||!description||!year){
//             return res.status(400).json({
//                 success:false,
//                 message:'All fields are required',
//             });
//         }
//         //create entry in db 
//         const branchDetails = await Branch.create({
//             name:name,
//             description:description,
//             year:year,
//         });
//         console.log(branchDetails);
//         return res.status(200).json({
//             success:true,
//             message:'Branch created Successfully',
//             branchDetails: branchDetails
//         });
//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:'Error while creating branch',
//         });
//     }
// };

//get all branches of required year
exports.showAllBranch = async(req,res)=>{
    try{
        //fetch Data
        const {year} = req.body;
        console.log(year)

        if(!year){
            return res.status(400).json({
                success:false,
                message:"No year found in input"
            })
        }

        // Convert the year from a string to an integer for the database query.
        const yearInt = parseInt(year, 10);

        // If the provided year is not a valid number, return an error.
        if (isNaN(yearInt)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year format. Please provide a number.',
            });
        }

        // 3. Build and execute the MongoDB Aggregation Pipeline.
        // The aggregation pipeline is a series of stages that process documents.
        const branches = await Branch.aggregate([
            
            // STAGE 1: $match
            // Filter the documents to only include branches that have a curriculum
            // entry for the specified year. We use dot notation to query inside the array.
            {
                $match: {
                    'curriculum.year': yearInt
                }
            },

            // STAGE 2: $project
            // Reshape the output to our desired format. We will create the
            // 'totalStudents' and 'totalCourses' fields here.
            {
                $project: {
                    _id: '$_id', 
                     name: '$name', // Include the branch name
                    description: '$description', // Include the branch description
                    
                    // Calculate totalStudents by getting the size of the 'student' array.
                    totalStudents: {
                        $size: '$student'
                    },

                    // Calculate totalCourses for the specific year. This is a bit more complex.
                    totalCourses: {
                        // First, we need to find the specific curriculum object for the given year.
                        // We use $filter to search the 'curriculum' array.
                        $let: {
                            vars: {
                                yearCurriculum: {
                                    $filter: {
                                        input: '$curriculum',
                                        as: 'c', // 'c' represents a single element in the curriculum array
                                        cond: { $eq: ['$$c.year', yearInt] }
                                    }
                                }
                            },
                            // $filter returns an array. Since we matched, it will have one element.
                            // We get that element at index 0, access its 'courses' array,
                            // and then get the size of it.
                            in: { $size: { $arrayElemAt: ['$$yearCurriculum.courses', 0] } }
                        }
                    }
                }
            }
        ]);

        console.log(branches)

        // 4. Send the response.
        // If no branches are found for that year, it will correctly return an empty array.
        res.status(200).json({
            success: true,
            message:"found",
            branches:branches,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Error while getting all Branch',
            error:error,
        });
    }
}

// exports.showAllBranch = async(req,res)=>{
//     try{
//         //fetch Data
//         const {year} = req.body;
//         const allBranch = await Branch.find({year:year});
//         return res.status(200).json({
//             success:true,
//             message:'All branch are fetched',
//             allBranch,
//         })
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:'Error while getting all Branch',
//         });
//     }
// }

//get students of required branch and year 
//anyone can access
exports.showBranchDetails = async (req, res) => {
    try {
        // Extract branch ID from request body
        const { branchId } = req.body;
        console.log("branch id is ",branchId);

        // Fetch the branch and populate its students sorted by roll number
        const branchDetails = await Branch.findById(branchId).populate({
            path: "student",
            select: "rollNo firstName lastName",
            options: { sort: { rollNo: 1 } }, // Sort students by rollNo
        });

        // Check if the branch exists
        if (!branchDetails) {
            return res.status(404).json({
                success: false,
                message: "Branch not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Branch details fetched successfully.",
            branch: {
                branchName: branchDetails.name, 
                year: branchDetails.year, 
                students: branchDetails.student, // Already sorted
            },
        });
    } 
    catch (error) {
        console.error("Error fetching branch details:", error);
        return res.status(500).json({
            success: false,
            message: "Error while getting branch details.",
            error:error,
        });
    }
};