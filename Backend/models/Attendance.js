const mongoose = require("mongoose");

const attendance = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    year:{
        type:Number,
        required:true,
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch",
        required:true,
    },
    mark:{
        type:Bool,
        default:false,
    },
    date:{
        type:Date,
        default:Date.now(),
        required:true,
    }
});

module.exports = mongoose.model("Attendance", attendance);