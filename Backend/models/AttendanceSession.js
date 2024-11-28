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
        // index: {expires:'0s'},//TTL Index, auto deletes entry from database after session expiration, space optimisation
    },
});

module.exports = mongoose.model("AttendanceSession", attendanceSessionSchema);
