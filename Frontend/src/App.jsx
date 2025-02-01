import { Routes, BrowserRouter, Route } from "react-router-dom";
import './index.css'
import Geolocation from "./pages/Geolocation";
import Branch from "./components/core/Branch/Branch";
import CreateBranch from "./components/core/Branch/CreateBranch";
import BranchDetails from "./components/core/Branch/BranchDetails";
import CreateCourse from "./components/core/Course/CreateCourse";
import GetAllCourses from "./components/core/Course/GetAllCourses";
// import RegisterStudent from "./components/core/Auth/SignUp";
import Take_Image from "./components/core/attendance/Take_Image";
import TestData from "./components/core/attendance/MarkAttendance";
import Navbar from "./components/common/Navbar";
import Home from './Home'
import Dashboard from "./components/core/dashboard/AdminDashBoard";
import VerifyEmail from './pages/VerifyEmail'
import SignUp from './components/core/Auth/SignUp'
import Login from './components/core/Auth/Login'
import Teacher from "./components/core/dashboard/Teacher";
import StudentDashboard from "./components/core/dashboard/StudentDashboard";
import Take_Attendance from "./components/core/attendance/Take_Attendance";
// import TeacherRegister from "./components/core/teacher/register";
import GetAttendance from "./components/core/attendance/GetAttendance";
import WebcamCapture from "./pages/VerifyFace";
import VerifyLocation from "./pages/VerifyLocation";

function App() {

  return (
   <>

  
   
   <Navbar/>
   <Routes>
    <Route exact path='/' element={<Home/>}/>
    <Route exact path='/branch' element={<Branch/>}/>
    <Route exact path='/create_branch' element={<CreateBranch/>}/>
    <Route exact path='/branch/:branch_id' element={<BranchDetails/>}/>
    <Route exact path = '/create_course' element={<CreateCourse/>}/>
    <Route exact path = '/show_courses' element={<GetAllCourses/>}/>
    {/* <Route exact path = '/add_student' element={<RegisterStudent/>}/> */}
    <Route exact path = '/take_image' element={<Take_Image/>}/>
    <Route exact path = '/mark_attendance/:course' element={<TestData/>}/>
    <Route exact path = '/location' element={<Geolocation/>}/>
    <Route exact path = '/admin_dashboard' element={<Dashboard/>}/>
    <Route exact path = '/teacher_dashboard' element={<Teacher/>}/>
    <Route exact path = '/student_dashboard' element={<StudentDashboard/>}/>
    <Route exact path = '/signup' element={<SignUp/>}/>
    <Route exact path = '/verify-email' element={<VerifyEmail/>}/>
    <Route exact path = '/login' element={<Login/>}/>
    <Route exact path = '/take_attendance' element={<Take_Attendance/>}/>
    {/* <Route exact path = '/teacher_register' element={<TeacherRegister/>}/> */}
    <Route exact path = '/getAttendance/:year/:id' element={<GetAttendance/>}/>
    <Route exact path = '/verify_face/:course' element={<WebcamCapture/>}/>
    <Route exact path = '/verify_location/:course/:encrypted_id' element={<VerifyLocation/>}/>

   </Routes>
 

   </>
  );
}

export default App;
