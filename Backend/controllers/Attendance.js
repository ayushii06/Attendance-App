const Attendance = require("../models/Attendance");
const Course = require("../models/Course");
const User = require("../models/User");

function isWithin100Meters(userLat, userLon, centerLat, centerLon) {
    if(!userLat ||  !userLon || !centerLat || !centerLon){
        return false;
    }
    // Earth's radius in meters
    const R = 6371000;

    // Convert latitude and longitude from degrees to radians
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const userLatRad = toRadians(userLat);
    const userLonRad = toRadians(userLon);
    const centerLatRad = toRadians(centerLat);
    const centerLonRad = toRadians(centerLon);

    // Differences in coordinates
    const deltaLat = centerLatRad - userLatRad;
    const deltaLon = centerLonRad - userLonRad;

    // Haversine formula
    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(userLatRad) * Math.cos(centerLatRad) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in meters
    const distance = R * c;

    // Check if the distance is within 100 meters
    return distance <= 100;
}

let attendanceSession = {
    isActive: false,
    expiresAt: null,
    course:null,
    centerLat : null,
    centerLon : null,
};

// Start Attendance Session
exports.startAttendance = async(req, res) => {
    const { duration,latitude,longitude,course,year,branch } = req.body; // duration in minutes

    if (!duration || typeof duration !== "number" || duration <= 0 || !course ||!year || !branch) {
        return res.status(400).json({ error: "Invalid details, Login Again" });
    }
    if(!latitude || !longitude){
        return res.status(404).json({
            success:false,
            message:"Location not found",
            error:error.message,
        });
    }

    // Set the expiration time
    const now = new Date();
    attendanceSession.isActive = true;
    attendanceSession.expiresAt = new Date(now.getTime() + duration * 60 * 1000); // Add duration in ms
    attendanceSession.course = course;


    attendanceSession.centerLat = latitude;
    attendanceSession.centerLon = longitude;

    res.status(200).json({
        message: `Attendance session started for ${duration} minutes.`,
        expiresAt: attendanceSession.expiresAt,
    });
};

// Mark Attendance
exports.markAttendance = async (req, res) => {
    const userId = req.user.id;
    const { course, latitude, longitude } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required. Login Again" });
    }

    if (!attendanceSession.isActive || new Date() > attendanceSession.expiresAt) {
        return res.status(403).json({ error: "Attendance session is not active or has expired" });
    }

    if (!course || course !== attendanceSession.course) {
        return res.status(404).json({
            success: false,
            message: "Attendance for this Course is not available now",
        });
    }

    if (!latitude || !longitude) {
        return res.status(404).json({
            success: false,
            message: "Location details not found",
        });
    }

    if (isWithin100Meters(latitude, longitude, attendanceSession.centerLat, attendanceSession.centerLon)) {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this ID. Login Again",
            });
        }

        await Attendance.create({
            userId,
            courseId: course,
            year: user.year,
            branch: user.branch,
            mark: true, // Attendance marked as present
            date: Date.now(),
        });

        return res.status(200).json({ message: `Attendance marked as present for user ${userId}` });
    } else {
        return res.status(400).json({
            message: "User is outside the 100-meter radius. Attendance not marked.",
        });
    }
};


// Stop Attendance Session
exports.stopAttendance = (req, res) => {
    attendanceSession.isActive = false;
    attendanceSession.expiresAt = null;
    attendanceSession.course = null;

    res.status(200).json({ message: "Attendance session stopped" });
};

// Branch course attendance
// Only for instructor or admin
exports.getCourseAttendance = async (req, res) => {
    try {
        const { course, year, branch } = req.body;

        const attendanceRecords = await Attendance.find({
            courseId: course,
            year,
            branch,
        })
            .populate({
                path: "userId",
                select: "rollNo firstName lastName",
            })
            .populate("courseId")
            .exec();

        const normalizedRecords = attendanceRecords.map((record) => {
            const normalizedDate = new Date(record.date);
            normalizedDate.setUTCHours(0, 0, 0, 0); // Normalize date to start of the day
            return {
                ...record._doc,
                date: normalizedDate, // Replace the date with the normalized day-wise date
            };
        });

        // Sort by date (day-wise) and roll number
        normalizedRecords.sort((a, b) => {
            if (a.date.getTime() !== b.date.getTime()) {
                return a.date - b.date; // Sort by date (ascending)
            }
            return a.userId.rollNo - b.userId.rollNo; // Sort by roll number (ascending)
        });

        return res.status(200).json({
            success: true,
            message: "Attendance fetched successfully",
            normalizedRecords,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get attendance for the specified course",
            error: error.message,
        });
    }
};


// Student own attendance records course-wise
exports.getStudentAttendanceByCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        const { course } = req.body;

        if (!userId || !course) {
            return res.status(400).json({ error: "Student ID and Course ID are required." });
        }

        const student = await User.findById(userId).populate("courses");
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        const enrolledCourse = student.courses.find(
            (courseId) => courseId._id.toString() === course.toString()
        );
        if (!enrolledCourse) {
            return res.status(400).json({ error: "Student is not enrolled in the specified course." });
        }

        const courseDetails = await Course.findById(course);
        if (!courseDetails) {
            return res.status(404).json({ error: "Course not found." });
        }

        const attendanceRecords = await Attendance.find({
            userId,
            courseId: course,
        }).exec();

        const normalizedRecords = attendanceRecords.map((record) => {
            const normalizedDate = new Date(record.date);
            normalizedDate.setUTCHours(0, 0, 0, 0); // Normalize date
            return {
                ...record._doc,
                date: normalizedDate,
            };
        });

        const trueMarkedCount = normalizedRecords.filter((record) => record.mark === true).length;

        normalizedRecords.sort((a, b) => a.date - b.date); // Sort by date

        res.status(200).json({
            student: `${student.firstName} ${student.lastName}`,
            course: courseDetails.courseName,
            attendance: normalizedRecords,
            noOfPresent: trueMarkedCount,
            noOfLectures: courseDetails.lectures,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while fetching student attendance records." });
    }
};

