import React, { useState } from "react";
import { useCheckSessionMutation } from "../../../services/attendanceApi";
import { useVerifyFaceMutation } from "../../../services/faceApi";
import { useGetMarkAttendanceMutation } from "../../../services/attendanceApi";
import VerifyingFace from "./VerifyFace"; // FIX: Corrected import path/filename



function MarkAttendance({ user }) {
  const [checkSession, { isLoading }] = useCheckSessionMutation();
  const [verifyFace, { isLoading: isVerifying, isSuccess, isError }] =
    useVerifyFaceMutation();
  const [markAttendance, { isLoading: isMarkingAttendance }] = useGetMarkAttendanceMutation();

  const [course, setCourse] = useState("");
  const [statusMap, setStatusMap] = useState({}); // key: courseId, value: true/false/null

  const [step, setStep] = useState(1); // 1: Verify Session, 2: if active, verify Face 3 : Verified

  // Mock user data for standalone testing
  const courses = user ? user.courses : [];
  
  const handleAttendanceSession = async () => {
    if (!course) {
      console.error("Please select a course");
      setStatusMap((prev) => ({ ...prev, [course]: undefined }));
      return;
    }

    try {
      const response = await checkSession({ course });
      console.log("Response from checkSession:", response);

      // Assuming the response structure is { data: { success: boolean } }
      if (response.data?.success) { 
        console.log("Session is active and valid.");
        setStatusMap((prev) => ({ ...prev, [course]: true }));
        setStep(2);
      } else {
        setStatusMap((prev) => ({ ...prev, [course]: false }));
        setStep(1); // Stay on step 1 to show the error
      }
    } catch (error) {
      console.error("Error checking attendance session:", error);
      setStatusMap((prev) => ({ ...prev, [course]: false }));
      setStep(1);
    }
  };

  const setAttendance = ({latitude,longitude}) => {
    return markAttendance({course: course, latitude, longitude }).unwrap();
  }

  console.log("User in MarkAttendance:", user);
  
  const formFieldStyle =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-2.5";

  return (
    <div className="p-8  min-h-screen">
      
      {step === 1 && (
        <div className="w-full mt-12  max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
          <div className="text-2xl mb-4 text-center font-bold text-gray-800">
            Ready to Mark Attendance
          </div>
          <div className="text-center text-sm text-gray-600 mb-6">
            Select your course to begin the verification process.
          </div>

          {/* Status Message */}
          {statusMap[course] !== undefined && (
            <div
              className={`mb-6 p-4 rounded-lg text-center font-medium ${
                statusMap[course]
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {statusMap[course]
                ? "Active attendance session found. Proceed to verification."
                : "No active attendance session found for this course. Please contact your instructor."}
            </div>
          )}

          {/* Form */}
          <label htmlFor="course-select" className="block mb-3 text-sm font-semibold text-gray-900">
            Select Course <span className="text-red-500">*</span>
          </label>
          <select
            id="course-select"
            name="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className={formFieldStyle}
            required
          >
            <option value="" disabled>
              --- Select Course ---
            </option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName}
              </option>
            ))}
          </select>

          <div className="mx-auto mt-8">
            <button
              onClick={handleAttendanceSession}
              disabled={!course || isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 transition transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? "Checking Session..." : "Check Attendance Session"}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Face Verification */}
      {step === 2 && statusMap[course] && (
        <VerifyingFace 
          setStep={setStep} 
          course={course} 
          markAttendance={setAttendance} // setAttendance is passed as markAttendance prop
        />
      )}

      {/* Step 3: Success Confirmation */}
      {step === 3 && statusMap[course] && (
        <div className="w-full max-w-md mx-auto bg-green-50 rounded-xl shadow-xl p-10 mt-10 border-4 border-green-200">
          <div className="text-4xl mb-3 text-center text-green-600">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="text-2xl mb-2 text-center font-bold text-gray-800">Attendance Recorded!</div>
          <div className="text-center text-md text-gray-600 mb-6">
            Your attendance has been successfully marked for the selected course.
          </div>
          <button
            onClick={() => { setStep(1); setCourse(""); setStatusMap({}); }}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Mark Another Attendance
          </button>
        </div>
      )}
    </div>
  );
}

export default MarkAttendance;
