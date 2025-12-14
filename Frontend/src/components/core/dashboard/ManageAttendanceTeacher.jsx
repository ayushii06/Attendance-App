import { useEffect, useState } from "react";
import {
  useGetCourseAttendanceMutation,
  useGetLectureDatesByCourseMutation,
} from "../../../services/attendanceApi";
import {
  useGetBranchDetailsMutation,
  useGetBranchesByYearMutation,
} from "../../../services/branchApi";

function ManageTeacherAttendance({ user }) {
  //course, year, branch,
  const courses = user?.courses || [];
  const [branches, setBranches] = useState([]);
  const [getCourseAttendance, { isLoading: isLoadingAttendance }] =
    useGetCourseAttendanceMutation();
  const [getBranchesByYear] = useGetBranchesByYearMutation();
  const [getBranchDetails] = useGetBranchDetailsMutation();
  const [getLectureDatesByCourse] = useGetLectureDatesByCourseMutation();

  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [dates, setDates] = useState([]);
  function datetoISt(input) {
    const date = new Date(input);

    // Format only the date part in IST
    const formattedIST = date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });

    return formattedIST;
  }

  const totalAttendanceSessions = async () => {
    const res = await getLectureDatesByCourse({ course: course }).unwrap();
    console.log("dates", res);

    setDates(res);
  };

  useEffect(() => {
    totalAttendanceSessions();
  }, [course]);

  const formFieldStyle =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

  const findBranchByYear = async (year) => {
    try {
      const response = await getBranchesByYear({ year }).unwrap();
      console.log("Branches for year:", response);
      setBranches(response || []);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
    setYear(course ? courses.find((c) => c._id === e.target.value).year : "");
    console.log(
      course ? courses.find((c) => c._id === e.target.value).year : ""
    );
    findBranchByYear(year);
  };

  const [students, setStudents] = useState([]);

  //get all students of that course , year , branch
  const getAllStudents = async () => {
    console.log("branch", branch);
    const res = await getBranchDetails({ branchId: branch }).unwrap();
    console.log("students", res);
    setStudents(res.students);
  };

  useEffect(() => {
    if (branch) getAllStudents();
  }, [branch]);

  const handleGetAttendanceRecords = async (e) => {
    e.preventDefault();
    if (!course || !year || !branch) {
      alert("Please select all fields");
      return;
    }
    try {
      const response = await getCourseAttendance({
        course,
        year,
        branch,
      }).unwrap();
      console.log("Attendance Records:", response);
      console.log("Attendance Records:", response.normalizedRecords);

      setAttendanceRecords(response.normalizedRecords || []);
      // console.log('Normalised Records:', response.normalisedRecords || []);
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        View Attendance Records
      </h1>
      <p className="text-gray-600">
        Here you can view and manage attendance records for all classes.
      </p>

      <form
        onSubmit={handleGetAttendanceRecords}
        className="flex items-end mt-8 gap-4 justify-evenly "
      >
        <div className="md:col-span-1 w-[80%]">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            name="courses"
            value={course}
            onChange={(e) => handleCourseChange(e)}
            className={formFieldStyle}
            required
          >
            <option value="" disabled>
              Select Course
            </option>
            {!courses.length > 0 ? (
              <option>No Courses Assigned</option>
            ) : (
              courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseName}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="md:col-span-1 w-[80%]">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Year <span className="text-red-500">*</span>
          </label>
          <select
            name="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={formFieldStyle}
            disabled={course}
            required
          >
            <option value="" disabled>
              Select Year
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="md:col-span-1 w-[80%]">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            name="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className={formFieldStyle}
            required
          >
            <option value="" disabled>
              Select Branch
            </option>
            {!branches.length > 0 ? (
              <option>No Branches Available</option>
            ) : (
              branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))
            )}
          </select>
        </div>
        <button type="submit" className="w-[30%]">
          Find
        </button>
      </form>

      <div className="overflow-x-auto mt-8 overflow-y-hidden ">
        {attendanceRecords.length == 0 ? (
          <>
            <div className="text-2xl text-center mt-20 font-semibold text-black">
              No Records Founds
            </div>
          </>
        ) : (
          <>
            {students?.length > 0 ? (
              <>
                <table className="min-w-full divide-y divide-gray-200 mt-8 ">
                  <thead className="bg-gray-50 ">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Roll No
                      </th>
                      {dates?.map((date) => (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <p className="">{date.date}</p>
                          <p className="">
                            {date.lectureNo ? `Lecture ${date.lectureNo}` : ""}
                          </p>
                        </th>
                      ))}
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    TOTAL
                                </th>

                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    PERCENTAGE
                                </th>
                    </tr>
                  </thead>
                  <tbody className='text-center'>
                            {students?.map((student) => {
                                return <tr key={student._id} className="bg-white divide-y divide-gray-200 " >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"  >
                                        
                                            {student.firstName}  {student.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.rollNo}
                                    </td>

                                    {
                                        dates.map((date) => {
                                            const record = attendanceRecords.find((record) => record.userId._id === student._id && datetoISt(record.date) === datetoISt(date.date))
                                            return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" >
                                                
                                                    {record ? record.mark ? <div className="text-green-500 font-medium">Present</div> :
                                                        <div className="
                                                    text-red-500 font-medium
                                                    ">Absent</div>
                                                        :
                                                        <div className="
                                                    text-red-500 font-medium">Absent</div>}
                                            </td>
                                        }
                                        )
                                    }

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                       {attendanceRecords.filter((record) => record.userId._id === student._id && record.mark).length}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                       {Math.floor(dates.length === 0 ? 0 : (attendanceRecords.filter((record) => record.userId._id === student._id && record.mark).length / dates.length) * 100)}%
                                    </td>
                                
                                </tr>


                            }
                            )}

                        </tbody>

                </table>
              </>
            ) : (
              <>
                  <div className="text-2xl text-center mt-20 font-semibold text-black">
                        No Students Founds
                  </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ManageTeacherAttendance;
