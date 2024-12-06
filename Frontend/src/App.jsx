import { Routes, BrowserRouter, Route } from "react-router-dom";
import './index.css'
import Geolocation from "./components/Student/Geolocation";
import Branch from "./components/dashboard/Branch/Branch";
import CreateBranch from "./components/dashboard/Branch/CreateBranch";
import BranchDetails from "./components/dashboard/Branch/BranchDetails";
import CreateCourse from "./components/dashboard/Course/CreateCourse";
import GetAllCourses from "./components/dashboard/Course/GetAllCourses";
import RegisterStudent from "./components/Student/RegisterStudent";
import Take_Image from "./components/Student/Take_Image";
import TestData from "./components/Student/MarkAttendance";
import Navbar from "./components/Navbar";
import Home from './Home'
import Dashboard from "./components/dashboard/AdminDashBoard";
import OTP from './components/admin/SignUp/otp'
import Login from './components/Student/Login'
import Teacher from "./components/dashboard/Teacher";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import Take_Attendance from "./components/attendance/Take_Attendance";
import TeacherRegister from "./components/teacher/register";
import { Provider } from "react-redux";
import { store } from "./reducer/reducer"; 
import GetAttendance from "./components/attendance/GetAttendance";


function App() {

  return (
   <>
   <Provider store={store}>

   
   <BrowserRouter>
  
   
   <Navbar/>
   <Routes>
    <Route exact path='/' element={<Home/>}/>
    <Route exact path='/branch' element={<Branch/>}/>
    <Route exact path='/create_branch' element={<CreateBranch/>}/>
    <Route exact path='/branch/:branch_id' element={<BranchDetails/>}/>
    <Route exact path = '/create_course' element={<CreateCourse/>}/>
    <Route exact path = '/show_courses' element={<GetAllCourses/>}/>
    <Route exact path = '/add_student' element={<RegisterStudent/>}/>
    <Route exact path = '/take_image' element={<Take_Image/>}/>
    <Route exact path = '/mark_attendance/:course' element={<TestData/>}/>
    <Route exact path = '/location' element={<Geolocation/>}/>
    <Route exact path = '/admin_dashboard' element={<Dashboard/>}/>
    <Route exact path = '/teacher_dashboard' element={<Teacher/>}/>
    <Route exact path = '/student_dashboard' element={<StudentDashboard/>}/>
    <Route exact path = '/signup/:role' element={<OTP/>}/>
    <Route exact path = '/take_attendance' element={<Take_Attendance/>}/>
    <Route exact path = '/teacher_register' element={<TeacherRegister/>}/>
    <Route exact path = '/login' element={<Login/>}/>
    <Route exact path = '/getAttendance/:year/:id' element={<GetAttendance/>}/>
    

   </Routes>
   </BrowserRouter>
    </Provider>

   </>
  );
}

export default App;
