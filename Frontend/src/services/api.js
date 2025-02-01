const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendOTP",
    SIGNUP_API: BASE_URL + "/auth/signUp",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
    CREATE_COURSE_API: BASE_URL + "/course/createCourse",
    GET_ALL_COURSES_API: BASE_URL + "/course/getAllCourses",
}

//BRANCH ENDPOINTS
export const branchEndpoints = {
    CREATE_BRANCH_API: BASE_URL + "/branch/createBranch",
    GET_ALL_BRANCHES_API: BASE_URL + "/branch/showAllBranch",
    GET_BRANCH_DETAILS_API: BASE_URL + "/branch/showBranchDetails",
}

//ATTENDANCE ENDPOINTS
export const attendanceEndpoints = {
    CREATE_ATTENDANCE_API: `${BASE_URL}/attendance/createAttendance`,
    GET_ATTENDANCE_API: `${BASE_URL}/attendance/getAttendance`,
    START_ATTENDANCE_API: `${BASE_URL}/attendance/startAttendance`,
    UPDATE_ATTENDANCE_EXPIRATION_API: `${BASE_URL}/attendance/updateAttendanceExpiration`,
    STOP_ATTENDANCE_API: `${BASE_URL}/attendance/stopAttendance`,
    MARK_ATTENDANCE_API: `${BASE_URL}/attendance/markAttendance`,
    GET_COURSE_ATTENDANCE_API: `${BASE_URL}/attendance/getCourseAttendance`,
    GET_STUDENT_ATTENDANCE_BY_COURSE_API: `${BASE_URL}/attendance/getStudentAttendanceByCourse`,
    GET_LECTURE_DATES_BY_COURSE_API: `${BASE_URL}/attendance/getLectureDatesByCourse`,
    GET_LECTURE_DATES_BY_COURSE_FOR_STUDENT_API: `${BASE_URL}/attendance/getLectureDatesByCourseForStudent`,
    RECOGNIZE_FACE_API: `${BASE_URL}/attendance/recognizeFace`
}