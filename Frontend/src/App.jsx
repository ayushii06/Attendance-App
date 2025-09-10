import { Routes, BrowserRouter, Route } from "react-router-dom";
// import './index.css'
// import Geolocation from "./pages/Geolocation";
// import Branch from "./components/core/Branch/Branch";
// import CreateBranch from "./components/core/Branch/CreateBranch";
// import BranchDetails from "./components/core/Branch/BranchDetails";
// import CreateCourse from "./components/core/Course/CreateCourse";
// import GetAllCourses from "./components/core/Course/GetAllCourses";
// import RegisterStudent from "./components/core/Auth/SignUp";
// import Take_Image from "./components/core/attendance/Take_Image";
// import TestData from "./components/core/attendance/MarkAttendance";
// import Navbar from "./components/common/Navbar";
// import Home from '../src/pages/Home'
// import Dashboard from "./components/core/dashboard/AdminDashBoard";
// import VerifyEmail from './pages/VerifyEmail'
import SignUp from './pages/SignupPage'
// import Login from './components/core/Auth/Login'
// import Teacher from "./components/core/dashboard/Teacher";
// import StudentDashboard from "./components/core/dashboard/StudentDashboard";
// import Take_Attendance from "./components/core/attendance/Take_Attendance";
// import TeacherRegister from "./components/core/teacher/register";
// import GetAttendance from "./components/core/attendance/GetAttendance";
// import WebcamCapture from "./pages/VerifyFace";
// import VerifyLocation from "./pages/VerifyLocation";
// import PrivateRoute from "./components/core/Auth/PrivateRoute";
import { useSelector } from "react-redux";
import AdminDashboard from "./components/core/AdminDashBoard";
import StudentDashboard from "./components/core/StudentDashboard";
import NotFound from "./pages/NotFound";
import InstructorDashboard from "./components/core/InstructorDashboard";
// import { ACCOUNT_TYPE } from "./utils/constants";
// import StudentRoute from "./components/core/Auth/StudentRoute";
// import TeacherRoute from "./components/core/Auth/TeacherRoute";
// import AdminRoute from "./components/core/Auth/AdminRoute";

function App() {

  // const user = useSelector((state) => state.profile.user);

  return (
    <>
      <Routes>
        {/* <Route exact path='/' element={<Home />} /> */}
        <Route exact path='/signup' element={<SignUp isLogin={false} />} />
        <Route exact path='/login' element={<SignUp isLogin={true} />} />
        <Route exact path='/dashboard/a/:id' element={<AdminDashboard/>} />
        <Route exact path='/dashboard/i/:id' element={<InstructorDashboard/>} />
        <Route exact path='/dashboard/s/:id' element={<StudentDashboard/>} />
        {/* <Route exact path='/verify-email' element={<VerifyEmail />} /> */}
        {/* <Route exact path='/login' element={<Login />} /> */}

        {/* admin routes */}
        {/* {
          user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route exact path='/branch' element={<Branch />} />
              <Route exact path='/create_branch' element={<CreateBranch />} />
              <Route exact path='/branch/:branch_id' element={<BranchDetails />} />
              <Route exact path='/create_course' element={<CreateCourse />} />
              <Route exact path='/show_courses' element={<GetAllCourses />} />
              <Route exact path='/admin_dashboard' element={<Dashboard />} />

            </>
          )
        } */}

        {/* teacher routes */}
        {/* {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route exact path='/teacher_dashboard' element={<Teacher />} />
            </>
          )
        } */}

        {/* student routes */}
        {/* <Route exact path='/student_dashboard' element={<StudentRoute><StudentDashboard /></StudentRoute>} />


        <Route exact path='/getAttendance/:year/:id' element={<PrivateRoute><GetAttendance /></PrivateRoute>} />
 */}

 <Route path="*" element={<NotFound/>} />

      </Routes>


    </>
  );
}

export default App;
