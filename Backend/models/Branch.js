const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },  
    student:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }],
    year:{
        type:Number,
        required:true,
    }
});

module.exports = mongoose.model("Branch",branchSchema);