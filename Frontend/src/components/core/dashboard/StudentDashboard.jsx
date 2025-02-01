import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../../services/operations/courseAPI';
import {getStudentAttendanceByCourse} from '../../../services/operations/attendanceAPI';
import dateToIST from '../../../utils/dateToIST';

const StudentDashboard = () => {
    const user = useSelector((state) => state.profile.user);
    console.log("User", user);
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const branch = user?.branch || "";
    const token = useSelector((state) => state.auth.token);
    console.log(token)
    const [courses, setCourses] = useState([]);
    const [total_lec, setTotal_lec] = useState(0);
    const [attended_lec, setAttended_lec] = useState(0);
    const [courseName, setCourseName] = useState('');
    const [instructor, setInstructor] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    
    // function datetoISt(input) {
    //     const date = new Date(input);

    //     // Get IST time offset (IST is UTC+5:30)
    //     const istOffset = 5 * 60 + 30; // 5 hours and 30 minutes in minutes

    //     // Convert the Date object to IST
    //     const istDate = new Date(date.getTime() + istOffset * 60 * 1000);

    //     const formattedIST = istDate.toLocaleString("en-US", {

    //         dateStyle: "medium",
    //     });

    //     return formattedIST;

    // }

    const getAllCourse = async () => {
        const res = await getAllCourses(branch,token);
        setCourses(res);
    }
        
    // const getAllCourses = async () => {
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/course/getAllCourses', {
    //             branchId: branch
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         console.log("out",res);

    //         if (res.status === 200) {
    //             setCourses(res.data.branch.courses);
    //         } else {
    //             alert(res.data.message);
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const navigate = useNavigate();

    const [needed_attendance, setNeeded] = useState(0);
    const [per, setPer] = useState(0);

    const fetchEnrolledCourses = async (id) => {
        try {
            const res = await getStudentAttendanceByCourse(id,token);
            console.log(res);
            if (res) {
                setEnrolledCourses(res.attendance);
                setTotal_lec(res.noOfLectures)
                setAttended_lec(res.noOfPresent)
                setNeeded(res.neededAttendance);
                setPer(res.attendancePercentage);
                document.getElementById('default-modal').classList.remove('hidden');
            }
            else{
                alert('Error')
            }
        } catch (error) {
            console.log(error);
        }
       
    }

    // const fetchEnrolledCourses = async (id) => {
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/attendance/getStudentAttendanceByCourse', {
    //             course: id
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         console.log(res);

    //         if (res.status === 200) {
    //             setEnrolledCourses(res.data.attendance);
    //             setTotal_lec(res.data.noOfLectures)
    //             setAttended_lec(res.data.noOfPresent)
    //             setNeeded(res.data.neededAttendance);
    //             setPer(res.data.attendancePercentage);

    //             document.getElementById('default-modal').classList.remove('hidden');
    //         } else {
    //             alert(res.data.message);
    //         }

    //     } catch (error) {
    //         console.log(error);

    //     }
    // };

    useEffect(() => {
        if(branch){
            getAllCourse();
        }
    }, []);



    const handleModalToggle = () => {
        setModalVisible(!modalVisible);
    };

    const handleModal2Toggle = () => {
        document.getElementById('default-modal').classList.add('hidden');
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleAttendance = () => {
        navigate(`/mark_attendance/${selectedCourse}`);
    };

    const handleAttendanceClick = (id) => {
        fetchEnrolledCourses(id);

    };

    return (
        <>
            <div className="mx-12 my-12">
                <div className="flex justify-between items-center">
                    <div className="text-2xl text-white font-bold">Welcome, {firstName} {lastName}!</div>
                    <button
                        onClick={handleModalToggle}
                        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        Take Attendance
                    </button>
                </div>

                {modalVisible && (
                    <div
                        className="fixed top-0 left-0
                        bg-black bg-opacity-50
                         z-10 p-4 w-full h-full"
                    >
                        <div className="
                        w-96 mx-auto my-40
                        bg-white dark:bg-gray-800
                        p-4 rounded-lg shadow-lg
                        dark:shadow-dark-lg
                        dark:text-gray-400

                        ">
                            <div className="flex justify-between items-center mb-4 z-50">
                                <h3 className="text-lg font-semibold">Select Course</h3>
                                <button
                                    onClick={handleModalToggle}
                                    className="text-white hover:bg-gray-200 rounded-lg w-8 h-8 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <select
                                    onChange={handleCourseChange}
                                    className="w-full p-2.5 text-white bg-gray-600 border rounded-lg"
                                >
                                    <option value="">Select a course</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.courseName}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAttendance}
                                    className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5"
                                >
                                    Take Attendance
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="text-center my-8 font-bold text-2xl underline">Your Enrolled Courses</div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Course Name</th>
                                <th className="px-6 py-3">Instructor</th>
                                <th className="px-6 py-3">Your Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr
                                    key={course._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 text-white dark:hover:bg-gray-600"
                                >
                                    <td className="px-6 py-4">{course.courseName}</td>
                                    <td className="px-6 py-4">Dr. {course?.instructor?.firstName} {course?.instructor?.lastName}</td>
                                    <td className="px-6 py-4">
                                        <button data-modal-target="default-modal"
                                            onClick={() => handleAttendanceClick(course._id)}

                                            data-modal-toggle="default-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                            View Attendance
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
            <div id="default-modal" tabIndex="-1" aria-hidden="true"
                className="fixed top-0 left-0 z-50 p-4 w-full h-full bg-black bg-opacity-80 hidden overflow-y">
                <div className="w-2/3  h-2/3 mx-auto my-32 overflow-x-auto overflow-y-auto">
                    <div className=" bg-black text-white rounded-lg shadow ">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-2xl  font-semibold text-gray-900 dark:text-white">
                                Your Attendance
                            </h3>
                            <button
                                onClick={handleModal2Toggle}
                                type="button"
                                className=""
                                data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 14 14">
                                    <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <div className="flex justify-center items-center gap-16">
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-400">You have attended {attended_lec} lectures till {dateToIST(Date.now())}</p>

                            </div>
                            <div className="text-center font-medium">
                                Attendance Percentage: {Math.floor(per)}%
                            </div>
                            <div className="text-center font-medium">
                                Minimum lectures required to attend: {needed_attendance}
                            </div>
                            <table className=" mx-auto my-44 w-full rounded text-center text-white bg-whit">
                                <thead className="text-lg uppercase " style={{ "background": "rgb(113 113 113)" }}>
                                    <tr>

                                        <th scope="col" className="px-6 py-3">
                                            DATE
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            ATTENDANCE
                                        </th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {enrolledCourses.map((record) => (
                                        <tr key={record._id} className=" border-gray-500 border-x-2 border-b-2" style={{ "background": "rgb(46 46 46)" }}>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-200">{dateToIST(record.date)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900 dark:text-gray-200">{record.mark ? <p className="
                                                    text-green-500

                                                    ">
                                                    PRESENT
                                                </p> : <p className="
                                                    text-red-500
                                                    ">
                                                    ABSENT
                                                </p>}</div>
                                            </td>


                                        </tr>
                                    ))}
                                </tbody>

                            </table>


                        </div>
                    </div>
                </div>
            </div></>
    );
};

export default StudentDashboard;
