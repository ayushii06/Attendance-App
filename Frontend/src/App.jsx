import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignupPage";
import AdminDashboard from "./components/core/AdminDashBoard";
import StudentDashboard from "./components/core/StudentDashboard";
import NotFound from "./pages/NotFound";
import InstructorDashboard from "./components/core/InstructorDashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivateRoute from "./components/common/PrivateRoute";


function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/aboutUs" element={<AboutUs />} />
        <Route exact path="/contactUs" element={<ContactUs />} />
        <Route exact path="/signup" element={<SignUp isLogin={false} />} />
        <Route exact path="/login" element={<SignUp isLogin={true} />} />
        <Route
          exact
          path="/dashboard/a/:id"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/dashboard/i/:id"
          element={
            <PrivateRoute>
              <InstructorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/dashboard/s/:id"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
