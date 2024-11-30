const mongoose = require("mongoose");

const attendance = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    lectureNo:{
        type:Number,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    mark: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now, // Corrected default value
        required: true,
    },
});

// Add indexes to improve query performance
attendance.index({ userId: 1, courseId: 1, date: 1 });

module.exports = mongoose.model("Attendance", attendance);