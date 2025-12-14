const Branch = require("../models/Branch");

//create Branch
//only admin
exports.createBranch = async (req,res)=>{
    try{
        //fetch data 
        const {name,description,year} = req.body;
        //validation 
        if(!name||!description||!year){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        //create entry in db 
        const branchDetails = await Branch.create({
            name:name,
            description:description,
            year:year,
        });
        console.log(branchDetails);
        return res.status(201).json({
            success:true,
            message:'Branch created Successfully',
            branchDetails: branchDetails
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while creating branch',
            error:error,
        });
    }
};

//get all branches of required year
//anyone can access
exports.showAllBranch = async(req,res)=>{
    try{
        //fetch Data
        const {year} = req.body;
        const allBranch = await Branch.find({year:year});
        return res.status(200).json({
            success:true,
            message:'All branch are fetched',
            allBranch,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Error while getting all Branch',
            error:error,
        });
    }
}

//get students of required branch and year 
//anyone can access
exports.showBranchDetails = async (req, res) => {
    try {
        // Extract branch ID from request body
        const { branchId } = req.body;

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