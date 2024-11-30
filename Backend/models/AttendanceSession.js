const mongoose = require("mongoose");

const attendanceSessionSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    centerLat: {
        type: Number,
        required: true,
    },
    centerLon: {
        type: Number,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index:true,
    },
    lectureNo:{
        type:Number,
        required:true,
    }
});
// Compound Index for Day-wise Queries and Optimized Sorting
attendanceSessionSchema.index({ createdAt: 1, lectureNo: -1 });

module.exports = mongoose.model("AttendanceSession", attendanceSessionSchema);
