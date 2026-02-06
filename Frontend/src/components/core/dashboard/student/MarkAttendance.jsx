import React, { useState } from "react";
import { useCheckSessionMutation } from "../../../../services/attendanceApi";
import { useVerifyFaceMutation } from "../../../../services/faceApi";
import { useGetMarkAttendanceMutation } from "../../../../services/attendanceApi";
import VerifyingFace from "./VerifyFace";

function MarkAttendance({ user }) {
  const [checkSession, { isLoading }] = useCheckSessionMutation();
  const [verifyFace] = useVerifyFaceMutation();
  const [markAttendance, { isLoading: isMarkingAttendance }] =
    useGetMarkAttendanceMutation();

  const [course, setCourse] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const courses = user ? user.courses : [];

  const handleAttendanceSession = async () => {
    if (!course) return;

    try {
      const response = await checkSession({ course });
      if (response.data?.success) {
        setStatusMap((prev) => ({ ...prev, [course]: true }));
        setStep(2);
      } else {
        setStatusMap((prev) => ({ ...prev, [course]: false }));
        
      }
    } catch {
      setStatusMap((prev) => ({ ...prev, [course]: false }));
    }
  };

  const setAttendance = ({ latitude, longitude }) => {
    return markAttendance({ course, latitude, longitude }).unwrap();
  };

  const formFieldStyle =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2.5 px-3";

  return (
    <div className=" px-4 py-6 sm:px-6 sm:py-10">
      {/* STEP 1 */}
      {step === 1 && (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 border">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Ready to Mark Attendance
          </h2>

          <p className="text-center text-sm text-gray-600 mt-2 mb-6">
            Select your course to begin verification
          </p>

          {/* Status */}
          {statusMap[course] !== undefined && (
            <div
              className={`mb-5 p-3 rounded-lg text-center text-sm font-medium ${
                statusMap[course]
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {statusMap[course]
                ? "Active session found"
                : "No active session for this course"}
            </div>
          )}

          {/* Course */}
          <label className="block mb-2 text-sm font-semibold">
            Select Course <span className="text-red-500">*</span>
          </label>

          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className={formFieldStyle}
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

          <button
            onClick={handleAttendanceSession}
            disabled={!course || isLoading}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Checking..." : "Check Attendance Session"}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && statusMap[course] && (
        <div className="max-w-xl mx-auto">
          <VerifyingFace
            setStep={setStep}
            course={course}
            markAttendance={setAttendance}
          />
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && statusMap[course] && (
        <div className="w-full max-w-sm mx-auto bg-green-50 rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-green-200 mt-10">
          <svg
            className="w-14 h-14 mx-auto mb-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h3 className="text-xl text-green-700 font-bold text-center">
            Attendance Recorded!
          </h3>

          <p className="text-center text-sm text-gray-600 mt-2 mb-5">
            Your attendance was marked successfully
          </p>

          <button
            onClick={() => {
              setStep(1);
              setCourse("");
              setStatusMap({});
            }}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700"
          >
            Mark Another Attendance
          </button>
        </div>
      )}

     
    </div>
  );
}

export default MarkAttendance;
