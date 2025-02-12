const { default: mongoose } = require("mongoose");
const Attendance = require("../models/Attendance");
const AttendanceSession = require("../models/AttendanceSession");
const Course = require("../models/Course");
const User = require("../models/User");
const axios = require("axios");


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
    return distance <= 5000;
}

// Start Attendance Session
exports.startAttendance = async(req, res) => {
    try{
        const userId = req.user.id;

        console.log(req.body);
        const { duration,latitude,longitude,course,year,branch,newLecture/*(true/false)*/ } = req.body; // duration in minutes

        const durationInt = parseInt(duration);
        console.log(typeof duration);
    
        if (!duration|| !durationInt|| durationInt <= 0 || !course ||!year || !branch) {
            return res.status(400).json({
                success:false,
                message:"Invalid details. Login again",
            });
        }
        if(!latitude || !longitude){
            return res.status(404).json({
                success:false,
                message:"Location not found",
                error:error.message,
            });
        }

        const lastSession = await AttendanceSession.findOne()
            .sort({ createdAt: -1 }) // Sort by latest creation date
            .select("lectureNo");
        const lectureNo = lastSession?.lectureNo ? newLecture ? lastSession.lectureNo + 1 : lastSession.lectureNo : 1;
        const reqCourse = await Course.findById(course);
        if(!reqCourse){
            return res.status(400).json({
                success:false,
                message:"Course not found",
            });
        }
        reqCourse.lectureNo = lectureNo;
        reqCourse.lectures = lectureNo>reqCourse.lectures?lectureNo:reqCourse.lectures;
        await reqCourse.save();
        if(reqCourse.instructor.toString()!==userId){
            return res.status(404).json({
                success:false,
                message:"Course is not yours",
            })
        }

    
        // End any existing active sessions for the same course
        await AttendanceSession.updateMany(
            { course, isActive: true },
            { $set: { isActive: false } }
        );
    
        // Set the expiration time
        const now = new Date();
        const session = new AttendanceSession({
            isActive: true,
            expiresAt: new Date(now.getTime() + durationInt * 60 * 1000),
            course,
            centerLat: latitude,
            centerLon: longitude,
            instructor:userId,
            lectureNo,
        });
    
        await session.save();
    
    
        res.status(200).json({
            success:true,
            message: `Attendance session started for ${durationInt} minutes.`,
            session,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while creating attendance session",
            error:error.message,
        })
    }
};

// Update Attendance Session Expiration Time
exports.updateAttendanceExpiration = async (req, res) => {
    try {
        
        const { course, newDuration } = req.body; // newDuration is in minutes
        const newDurationInt = parseInt(newDuration);
        if (!course || typeof newDurationInt !== "number" || newDurationInt <= 0) {
            return res.status(400).json({ 
                success:false,
                message: "Invalid course ID or duration." 
            });
        }
        // Find the active session for the given course
        const session = await AttendanceSession.findOne({ course, isActive: true });

        if (!session) {
            return res.status(400).json({ 
                success:false,
                message: "No active session for the course. Create new session" 
            });
        }

        // Calculate the new expiration time
        const now = new Date();
        const newExpiresAt = new Date(now.getTime() + newDurationInt * 60 * 1000);

        // Update the session's expiration time
        session.expiresAt = newExpiresAt;
        await session.save();

        res.status(200).json({
            success: true,
            message: "Session expiration time updated successfully.",
            session: {
                course: session.course,
                newExpiresAt: session.expiresAt,
            },
        });
    } 
    catch (error) {
        return res.status(400).json({ 
            success:false,
            message: "Error while updating time. Try again" 
        });
    }
};

// Mark Attendance
exports.markAttendance = async (req, res) => {
    try{
        const userId = req.user.id;
        const { course, latitude, longitude } = req.body;

        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course details not found",
            });
        }
        
        if (!latitude || !longitude) {
            return res.status(404).json({
                success: false,
                message: "Location details not found. Enable location and try again",
            });
        }
        // Fetch the active session for the course
        const session = await AttendanceSession.findOne({ course, isActive: true });
        console.log(session);

        if (!session || new Date() > session.expiresAt) {
            return res.status(404).json({
                success: false,
                message: "Attendance for this Course is not available now",
            });
        }
    
        if (!isWithin100Meters(latitude, longitude, session.centerLat, session.centerLon)) {
            return res.status(400).json({
                success:false,
                message: "User is outside the 100-meter radius. Attendance not marked.",
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this ID. Login Again",
            });
        }

        const attendanceExists = await Attendance.findOne({
            userId,
            courseId: course,
            date: { $gte: new Date().setUTCHours(0, 0, 0, 0) },
            lectureNo:session.lectureNo,
            mark:true,
        });
        if (attendanceExists) {
            return res.status(400).json({
                success:false,
                message:"Attendance already marked present",
            });
        }

        await Attendance.create({
            userId,
            courseId: course,
            instructor:session.instructor,
            year: user.year,
            branch: user.branch,
            mark: true, // Attendance marked as present
            date: new Date(),
            lectureNo:session.lectureNo,
        });

        return res.status(200).json({ 
            success:true,
            message: `Attendance marked as present for user ${userId}` 
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while marking attendance. Login again...",
            error:error.message,
        })
    }
};


// Stop Attendance Session
exports.stopAttendance = async (req, res) => {
    try {
        const { course } = req.body;
        if (!course) {
            return res.status(404).json({ 
                success:false,
                message: "No course found." 
            });
        }
        const session = await AttendanceSession.findOne({ course, isActive: true });
        if (!session) {
            return res.status(404).json({ 
                success:false,
                error: "No active session found for the course." 
            });
        }

        session.isActive = false;
        await session.save();

        res.status(200).json({
            success:true,
            message: "Attendance session stopped."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to stop attendance session." });
    }
};

// Branch course attendance
// Only for instructor 
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
            return res.status(400).json({
                success:false,
                message:"Student not enrolled in the course. Contact Admin.",
            });
        }

        const courseDetails = await Course.findById(course);
        if (!courseDetails) {
            return res.status(404).json({
                success:false,
                message:"Course not found",
            });
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

        const percentageAttendance = (trueMarkedCount*100)/(courseDetails.lectureNo);

        const reqAttendanceCount = Math.ceil(0.75*(courseDetails.lectures) - trueMarkedCount);

        const remainingAttendanceNeeded = reqAttendanceCount<0?0:reqAttendanceCount;

        res.status(200).json({
            student: `${student.firstName} ${student.lastName}`,
            course: courseDetails.courseName,
            attendance: normalizedRecords,
            noOfPresent: trueMarkedCount,
            noOfLectures:courseDetails.lectureNo,
            totalLecture: courseDetails.lectures,
            attendancePercentage:percentageAttendance,
            neededAttendance:remainingAttendanceNeeded,
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Error while fetching attendance for course",
            error:error.message,
        });
    }
};

//get dates of attendance session
exports.getLectureDatesByCourse = async (req, res) => {
    try {
    const {course} = req.body;
    // Step 1: Fetch attendance sessions for the course
    const attendanceSessions = await AttendanceSession.find(
        { course: course }, // Match the specified course
        { createdAt: 1, lectureNo: 1 } // Select only the required fields
    );

    // Step 2: Process the data in-memory to ensure uniqueness and sorting
    const uniqueSessions = Array.from(
        new Map(
            attendanceSessions.map((session) => [
                `${session.lectureNo}-${session.createdAt.toISOString().split("T")[0]}`, // Unique key: lectureNo + date
                { date: session.createdAt.toISOString().split("T")[0], lectureNo: session.lectureNo }, // Value
            ])
            ).values()
        );

        // Step 3: Sort by date and lectureNo
        uniqueSessions.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date); // Sort by date
            return a.lectureNo - b.lectureNo; // Sort by lectureNo within the same date
        });

        res.status(200).json({
            success: true,
            message: "Lecture dates fetched successfully",
            data: uniqueSessions,
        });
    } catch (error) {
        console.error("Error fetching lecture dates:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch lecture dates",
            error: error.message,
        });
    }

};

