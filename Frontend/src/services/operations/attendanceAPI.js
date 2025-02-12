import { toast } from "react-hot-toast"
import { startLoading, stopLoading, setAttendanceData, setError, } from '../../slice/attendanceSlice'
import { apiConnector } from "../apiconnector"
import { attendanceEndpoints } from "../api"


const { CREATE_ATTENDANCE_API, GET_ATTENDANCE_API, START_ATTENDANCE_API, UPDATE_ATTENDANCE_EXPIRATION_API, STOP_ATTENDANCE_API, MARK_ATTENDANCE_API, GET_COURSE_ATTENDANCE_API, GET_STUDENT_ATTENDANCE_BY_COURSE_API, GET_LECTURE_DATES_BY_COURSE_API, GET_LECTURE_DATES_BY_COURSE_FOR_STUDENT_API,RECOGNIZE_FACE_API } = attendanceEndpoints

export async function getCourseAttendance(course, year, branch,token) {
        const toastId = toast.loading("Loading...")
        let result = []
        try {
            const response = await apiConnector("POST", GET_COURSE_ATTENDANCE_API, {
                course,
                year,
                branch
            },{
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            })
            console.log("GET COURSE ATTENDANCE API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Course Attendance Fetched Successfully")
            result = response?.data?.normalizedRecords

        } catch (error) {
            console.log("GET COURSE ATTENDANCE API ERROR............", error)
            // toast.error(error.response?.data?.message||"Failed to Get Course Attendance")
        }
        toast.dismiss(toastId)
        return result
    }

export async function getLectureDatesByCourse(course, token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector("POST", GET_LECTURE_DATES_BY_COURSE_API, {
            course
        }, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        })

        console.log("GET LECTURE DATES BY COURSE API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success("Lecture Dates Fetched Successfully")
        result = response?.data?.data
    } catch (error) {
        console.log("GET LECTURE DATES BY COURSE API ERROR............", error)
        dispatch(setError("Could Not Get Lecture Dates By Course"))
    }
    toast.dismiss(toastId)
    return result
}

export async function markAttendance(course, latitude, longitude,token,navigate) {
    const toastId = toast.loading("Loading...")
    let result = false
    try {
        const response = await apiConnector("POST", MARK_ATTENDANCE_API, {
            course,
            latitude,
            longitude
        }, {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        })
        console.log("MARK ATTENDANCE API RESPONSE............", response)

        if (!response.data.success) {
            toast.error(response.data?.message || "Failed to Mark Attendance")
        }
        toast.success("Attendance Marked Successfully")
        result = true
    } catch (error) {
        console.log("MARK ATTENDANCE API ERROR............", error)
        toast.error(error.response?.data?.message || "Failed to Mark Attendance")
        toast.success("Redirecting to Student Dashboard")
        setTimeout(() => {
            navigate(`/student_dashboard`)
        }, 10000)
    }
    toast.dismiss(toastId)
    return result
}

export async function startAttendance(duration, latitude, longitude, course, year, branch, lecture,token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        let durations = parseInt(duration)
        console.log(typeof durations)

        const response = await apiConnector("POST", START_ATTENDANCE_API, {
            duration:durations,
            latitude,
            longitude,
            course,
            year,
            branch,
            newLecture: lecture == "true"?true:false,
        }, {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        })
        console.log("START ATTENDANCE API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success(response.data.message)
        result = response?.data?.session
    } catch (error) {
        toast.error("Failed to Start Attendance")
        console.log("START ATTENDANCE API ERROR............", error)
    }
    toast.dismiss(toastId)
    return result
}

export async function updateAttendanceExpiration(course, newDuration) {
    
        const toastId = toast.loading("Loading...")
        let res = false
        try {
            const response = await apiConnector("PUT", UPDATE_ATTENDANCE_EXPIRATION_API, {
                course,
                newDuration
            })
            console.log("UPDATE ATTENDANCE EXPIRATION API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success(response.data.message)
        } catch (error) {
            console.log("UPDATE ATTENDANCE EXPIRATION API ERROR............", error)
            toast.error("Failed to Update Attendance Expiration")
        }
        toast.dismiss(toastId)
        return res
    
    }

export async function stopAttendance(course, year, branch,token) {
    const toastId = toast.loading("Loading...")
    let result = false
    try {
        const response = await apiConnector("POST", STOP_ATTENDANCE_API, {
            course,
            year,
            branch
        }, {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        })
        console.log("STOP ATTENDANCE API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success(response.data.message)
        result = true
    } catch (error) {
        console.log("STOP ATTENDANCE API ERROR............", error)
        dispatch(setError("Failed to Stop Attendance"))
    }
    toast.dismiss(toastId)
    return result
}

export async function getStudentAttendanceByCourse(courseid, token) {
    let result = []
    const toastId = toast.loading("Loading...")

    try {
        const response = await apiConnector("POST", GET_STUDENT_ATTENDANCE_BY_COURSE_API, {course:courseid}, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("GET STUDENT ATTENDANCE BY COURSE API RESPONSE............", response)

        if (!response?.status === 200) {
            throw new Error("Could Not Get Student Attendance")
        }

        toast.success("Student Attendance Fetched Successfully")
        result = response?.data

    } catch (error) {
        console.log("GET STUDENT ATTENDANCE BY COURSE API ERROR............", error)
        toast.error("Failed to Get Student Attendance")
    }
    toast.dismiss(toastId)
    return result
}

export async function recognizeFace(image,token) {
    const toastId = toast.loading("Loading...")
    let result = false
    try {
        const response = await apiConnector("POST", RECOGNIZE_FACE_API, {
            image
        }, {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        })
        console.log("RECOGNIZE FACE API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success("Face Recognized Successfully")
        result = true
    } catch (error) {
        console.log("RECOGNIZE FACE API ERROR............", error)
        toast.error("Failed to Recognize Face")
    }
    toast.dismiss(toastId)
    return result
}