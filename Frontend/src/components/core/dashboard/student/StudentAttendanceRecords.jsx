import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetLectureDatesByCourseForStudentMutation,
  useGetStudentAttendanceByCourseMutation,
} from "../../../../services/attendanceApi";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  // Normalize date to handle potential time zone issues if needed, but keeping it simple for display
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

function StudentAttendanceRecords() {
  const courses = useSelector((state) => state.auth.user.courses);
  const userName = useSelector((state) => state.auth.user.firstName);
  console.log(courses);

  const [status, setStatus] = useState("Initial"); //initial,lectureError,attendanceError,attendanceSuccess
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [lectureDate, setLectureDate] = useState([]);
  const [error, setError] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [getStudentAttendance, { isLoading }] =
    useGetStudentAttendanceByCourseMutation();
  const [getLectureDates] = useGetLectureDatesByCourseForStudentMutation();

  const handleFindLectureDates = async (e) => {
    setStatus("Loading");
    e.preventDefault();

    if (!selectedCourse) {
      setError("Please Select a course");
      return;
    }

    try {
      const response = await getLectureDates({
        course: selectedCourse,
      }).unwrap();
      console.log("dates Records:", response);

      if (response.length === 0) {
        setStatus("LectureError");
        setError("No classes found for the selected course.");
        setLectureDate([]);
        return;
      }

      setLectureDate(response);

      handleFindAttendance();
    } catch (error) {
      setStatus("LectureError");
      setError("Failed to fetch attendance records. Please try again later.");
      console.error("Failed to fetch attendance records:", error);
    }
  };

  const handleFindAttendance = async () => {
    // e.preventDefault();

    console.log("Selected Course:", selectedCourse);

    if (!selectedCourse) {
      setError("Please select a course.");
      return;
    }

    try {
      const response = await getStudentAttendance({
        course: selectedCourse,
      }).unwrap();
      console.log("Attendance Records:", response);
      setStatus("AttendanceSuccess");
      
      if (response.length === 0) {
        //manually set records to empty array if no attendance found
        const emptyRecords = {
          student: userName,
          course:
          courses.find((course) => course._id === selectedCourse)
          ?.courseName || "Unknown Course",
          noOfPresent: 0,
          noOfLectures: totalLecture.length || 0,
          totalLecture: courses.find((course) => course._id === selectedCourse)
          ?.lectures || 0,
          lectureDates: lectureDate,
          attendance: [],
          attendancePercentage: 0,
          neededAttendance: Math.ceil(lectureDate.length * 0.75), // 75% of total lectures
        };
        
        setAttendanceRecords(emptyRecords);
      }
      setAttendanceRecords(response);
    } catch (error) {
      setStatus("AttendanceError");
      setError("Failed to fetch attendance records. Please try again later.");
      console.error("Failed to fetch attendance records:", error);
    }
  };

  const formFieldStyle =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5";

  const StatCard = ({ title, value, colorClass, icon }) => (
    <div
      className={`bg-white p-5 rounded-xl shadow-lg border-b-4 ${colorClass} transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase">
            {title}
          </p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="text-3xl opacity-70">{icon}</div>
      </div>
    </div>
  );

  const AttendanceDetailTable = ({ attendanceRecords }) => {
    // Create a Set of present dates for efficient lookup

    console.log("lecture dates ", lectureDate);

    const presentDatesSet = useMemo(() => {
      if (!attendanceRecords || attendanceRecords.length === 0) {
        return new Set(); // empty set (no dates marked as present)
      }

      // Otherwise, build a set of normalized dates from attendanceRecords
      return new Set(
        attendanceRecords.map(
          (record) => new Date(record.date).toISOString().split("T")[0]
        )
      );
    }, [attendanceRecords]);

    return (
      <div className="mt-8">
        <h3 className="text-xl font-normal text-center text-gray-800 mb-4 border-b pb-2">
          Detailed Lecture Record
        </h3>
        <div className="overflow-x-auto rounded-xl shadow-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600 text-white sticky top-0">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  Lecture Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {lectureDate &&
                lectureDate.length > 0 &&
                lectureDate.map((lecture, index) => {
                  const lectureDate = new Date(lecture.date)
                    .toISOString()
                    .split("T")[0];
                  const isPresent = presentDatesSet.has(lectureDate);

                  // The actual logic to identify future classes to attend is complex
                  // as it depends on a 'current date' and 'future class' flag in real data.
                  // Here, we just highlight historical attendance status.

                  const statusText = isPresent ? "P" : "A";
                  const statusColor = isPresent
                    ? "bg-green-100 text-green-800 font-semibold"
                    : "bg-red-100 text-red-800 font-semibold";

                  return (
                    <tr key={lecture.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lecture.lectureNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(lecture.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 rounded-full ${statusColor}`}
                        >
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-center text-gray-500">
          P = Present, A = Absent. Total records: {lectureDate.length}
        </p>
      </div>
    );
  };

  console.log("attenadce", attendanceRecords);

  // Render Attendance Summary/Details
  const renderAttendanceDetails = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) return null;

    console.log("gbgfbf", lectureDate);
    const {
      student,
      course,
      noOfPresent,
      noOfLectures,
      totalLecture,
      attendance,
      attendancePercentage,
      neededAttendance,
    } = attendanceRecords;

    console.log("atten rec", attendanceRecords);

    // Determine color for the attendance percentage display
    const percentColor =
      attendancePercentage >= 75
        ? "border-green-500 text-green-700"
        : attendancePercentage >= 60
        ? "border-yellow-500 text-yellow-700"
        : "border-red-500 text-red-700";

    return (
      <div className="mt-12 p-8  rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-semibolder text-center text-indigo-700 border-b pb-3 mb-6">
          <span className="text-gray-800">{student}'s</span> Attendance for{" "}
          {course}
        </h2>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Expected Lectures"
            value={totalLecture}
            colorClass="border-blue-500"
            icon={
              <svg
                className="w-8 h-8 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 12h-2v-4h2v4zm0-6H9V6h2v2z" />
              </svg>
            }
          />
          <StatCard
            title="Lectures Taken By Proff"
            value={noOfLectures}
            colorClass="border-blue-500"
            icon={
              <svg
                className="w-8 h-8 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 12h-2v-4h2v4zm0-6H9V6h2v2z" />
              </svg>
            }
          />
          <StatCard
            title="Lectures Attended By You"
            value={noOfPresent}
            colorClass="border-green-500"
            icon={
              <svg
                className="w-8 h-8 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m-6 4a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            }
          />
          <StatCard
            title={`Minimum Lectures for 75%`}
            value={neededAttendance}
            colorClass="border-indigo-500"
            icon={
              <svg
                className="w-8 h-8 text-indigo-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM10 8a5 5 0 00-5 5v2a2 2 0 002 2h6a2 2 0 002-2v-2a5 5 0 00-5-5z" />
              </svg>
            }
          />
          <StatCard
            title="Current Percentage"
            value={`${attendancePercentage}%`}
            colorClass={percentColor.replace("border-", "border-")}
            icon={
              <svg
                className="w-8 h-8 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
              </svg>
            }
          />
        </div>

        {/* Actionable Insight Section */}
        <div className="p-5 mt-4 rounded-xl shadow-inner bg-gray-50 border border-dashed border-gray-300">
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            Attendance Goal 75% Analysis:
          </h3>
          {attendancePercentage >= 75 ? (
            <p className="flex items-center text-lg font-semibold text-green-600">
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Excellent! You have already met the minimum requirement of 75%
              attendance.
            </p>
          ) : (
            <p className="flex items-center text-lg font-bold text-red-600 p-2 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold text-xl mr-1">{neededAttendance}</span>
              {neededAttendance === 1 ? "class " : "classes "}
              must be attended to achieve the 75% requirement.
            </p>
          )}
        </div>

        {/* Detailed Attendance Table */}
        {totalLecture && (
          <AttendanceDetailTable attendanceRecords={attendance} />
        )}
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Student Attendance Record
        </h1>
      </div>

      {/* Course Selection Form */}
      <form
        onSubmit={handleFindLectureDates}
        className="flex items-end gap-4 justify-evenly "
      >
        <div className="md:col-span-1 w-[80%]">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Select Course <span className="text-red-500">*</span>
          </label>
          <select
            name="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={formFieldStyle}
            required
          >
            <option value="" disabled>
              Select a course
            </option>
            {courses.length === 0 ? (
              <option disabled>No courses available</option>
            ) : (
              courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))
            )}
          </select>
        </div>

        <button
          type="submit"
          className="w-[30%] rounded-lg bg-gray-800 p-3 font-semibold text-white hover:bg-gray-700"
          disabled={isLoading || courses.length === 0}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white inline"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              ></circle>
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Get Records"
          )}
        </button>
      </form>

      {status === "Initial" && (
        <>
          <div className="text-center mt-12 p-10 text-black">
            <p className="text-sm">
              Please select a course and click 'Get Records' to view the
              attendance details and 75% goal analysis.
            </p>
          </div>
        </>
      )}

      {/* Loading State */}
      {status === "Loading" && (
        <div className="text-center mt-8 text-xl text-indigo-600 font-medium p-4 rounded-lg bg-indigo-50">
          Fetching attendance data...
        </div>
      )}

      {status === "LectureError" && (
        <>
          <div
            className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg"
            role="alert"
          >
            <p className="font-bold">Error in finding records :</p>
            <p>{error}</p>
          </div>
        </>
      )}

      {status === "AttendanceSuccess" && (
        <>
          {attendanceRecords.length === 0 ? (
            <>
              {/* no attendance records found for the course */}
              <div className="text-center mt-12 p-10 text-black">
                <p className="text-lg font-semibold">
                  No attendance records found for the selected course.
                </p>
              </div>
            </>
          ) : (
            <>
              {attendanceRecords && lectureDate && lectureDate.length > 0 && (
                <div className="mt-8">{renderAttendanceDetails()}</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
export default StudentAttendanceRecords;
