
// const branchSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//     },  
//     student:[{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//     }],
//     courses:[{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Course",
//     }],
//     year:{
//         type:Number,
//         required:true,
//     }
// });

//CHANGE NO2 
const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // A branch name should be unique
    },
    description: {
        type: String,
        required: true,
    },
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    // This is the new structure
    curriculum: [{
        year: {
            type: Number,
            required: true,
        },
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }]
    }]
});
module.exports = mongoose.model("Branch", branchSchema);