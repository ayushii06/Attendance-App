const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
        trim:true
    },
    courseDescription:{
        type:String,
        required:true,
        trim:true,
    },
    year:{
        type:Number,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    branch:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    }],
    lectures:{
        type:Number,
        required:true,
    }
});

module.exports = mongoose.model("Course", courseSchema);