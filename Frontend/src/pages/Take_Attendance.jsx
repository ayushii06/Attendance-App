// import React, { useEffect } from 'react'
// import { useState } from 'react'
// import axios from 'axios'
// import { useDispatch } from 'react-redux'
// import { useSelector } from 'react-redux'
// import { startAttendance, updateAttendanceExpiration, stopAttendance } from '../services/operations/attendanceAPI'
// import { getAllCourses } from '../services/operations/courseAPI'
// import { getAllBranches } from '../services/operations/branchAPI'
// import getCoords from '../utils/getLocation'
// import dateToIST from '../utils/datetoIST'
// import { useNavigate } from 'react-router-dom'

// const Take_Attendance = () => {
//     const navigate = useNavigate()
//     const [sesionStarted, setSessionStarted] = useState(false);
//     const [expiresAt, setExpiresAt] = useState("")
//     const [courses, setCourses] = useState([])
//     const [branches, setBranches] = useState([])
//     const token = useSelector(state => state.auth.token)

//     const getLocation = async () => {
//         try {
//             const location = await getCoords();
//             setCredentials({
//                 ...credentials,
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//             });
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     let currentDate = Date.now();
//     currentDate = dateToIST(currentDate);

//     function datetoISTwithTime(input) {
//         const date = new Date(input);

//         // Get IST time offset (IST is UTC+5:30)
//         const istOffset = 5 * 60 + 30; // 5 hours and 30 minutes in minutes

//         // Convert the Date object to IST
//         const istDate = new Date(date.getTime());

//         const formattedIST = istDate.toLocaleString("en-US", {
//             timeStyle: "medium",
//             dateStyle: "medium",
//         });

//         return formattedIST;

//     }

//     const [credentials, setCredentials] = useState({
//         duration: 0, course: "", year: "", branch: "", latitude: null, longitude: null, lecture: ""
//     })

//     const getAllBranch = async () => {
//         const branches = await getAllBranches(credentials.year, token)
//         setBranches(branches)
//     }

//     useEffect(() => {
//         getAllBranch()
//     }, [credentials.year])

//     const getCourses = async () => {
//         const courses = await getAllCourses(credentials.branch, token)
//         setCourses(courses)
//     }

//     useEffect(() => {
//         if (credentials.branch) {
//             getCourses();
//         } else {
//             setCourses([]);
//         }
//     }, [credentials.branch]);

//     const handleChange = (e) => {
//         setCredentials({
//             ...credentials,
//             [e.target.name]: e.target.value
//         })
//     }

//     const handleSubmit = async (latitude, longitude) => {
//         // console.log("duration , type", credentials.duration, typeof (credentials.duration))

//         const res = await startAttendance(credentials.duration, latitude, longitude, credentials.course, credentials.year, credentials.branch, credentials.lecture, token)
//         console.log("res", res)

//         if (res != []) {
//             setSessionStarted(true)
//             setExpiresAt(res.expiresAt)
//         }

//     }

//     useEffect(() => {
//         if (!credentials.latitude && !credentials.longitude) {
//             getLocation();
//         }
//     }, [credentials.latitude, credentials.longitude]);

//     const handleStop = async () => {
//         const res = stopAttendance(credentials.course, credentials.year, credentials.branch, token);
//         if (res) {
//             setSessionStarted(false)
//             navigate('/teacher_dashboard')
//         }
//     }

//     const handleUpdate = async () => {
//         const res = updateAttendanceExpiration(credentials.course, parseInt(credentials.duration))
//         if (res != []) {
//             setExpiresAt(res.newExpiresAt)
//         }
//     }

//     const handleUpdateClick = () => {
//         document.getElementById('onUpdate').classList.toggle('hidden')

//     }

//     return (
//         <>
//             {sesionStarted ? <div className="text-center md:mx-12 mx-2 my-12">

//                 <div className="text-sm md:text-3xl font-bold my-12">Today's Attendance - {currentDate}</div>
//                 <div className="text-sm md:text-3xl  font-bold my-18">Closes at - {datetoISTwithTime(expiresAt)}</div>
//                 <button className='mt-4 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5' onClick={handleUpdateClick}>
//                     Update Closing Time
//                 </button>
//                 <div className="hidden" id='onUpdate'>
//                     <input type="number" className='mx-auto my-2 md:w-64 w-20 text-center  bg-gray-900 text-white py-2 px-4 rounded-lg ' placeholder="Enter new duration" name="duration" onChange={handleChange} value={credentials.duration} />
//                     <button className='mt-4 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5' onClick={handleUpdate}>Update</button>
//                 </div>
//                 <div className="my-12">
//                     <div className="my-4 text-xs md:text-sm">
//                         Wants to stop the attendance? Click the button below

//                     </div>
//                     <button className='mt-4 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5' onClick={handleStop}>Stop Attendance</button>

//                 </div>

//             </div> : <div className="items-center md:mx-12 mx-6 py-4 flex justify-center">
//                 <div className="bg-white md:w-6/12  dark:bg-gray-900">
//                     <div className="py-8 px-4 md:px-8 ">
//                         <h2 className="mb-4 text-lg md:text-3xl font-bold text-gray-900 text-center my-2 pb-4 dark:text-white">Start Attendance</h2>
//                         <form onSubmit={(e) => {
//                             e.preventDefault();
//                             handleSubmit(credentials.latitude, credentials.longitude);
//                         }}>

//                             <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
//                                 <div className="w-full">
//                                     <label for="brand" className="block mb-2 md:text-sm text-xs font-medium text-gray-900 dark:text-white">Enter year</label>
//                                     <select onChange={handleChange} value={credentials.year} name="year"
//                                         id="year" className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
//                                         <option selected="">Select Year</option>
//                                         <option value="1">1st</option>
//                                         <option value="2">2nd</option>
//                                         <option value="3">3rd</option>
//                                         <option value="4">4th</option>
//                                     </select>
//                                 </div>
//                                 <div className="w-full">
//                                     <label for="brand" className="block mb-2 md:text-sm text-xs font-medium text-gray-900 dark:text-white">Select Branches</label>
//                                     <select onChange={handleChange}
//                                         value={credentials.branch} name="branch"
//                                         id="branch" className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
//                                         <option selected="">Select Branches</option>
//                                         {branches.length === 0 ? <option value="">No Branches Found</option> :
//                                             branches.map((branch) => (
//                                                 <option key={branch._id} value={branch._id}>{branch.name}</option>
//                                             ))}


//                                     </select>
//                                 </div>

//                                 <div className="sm:col-span-2">
//                                     <label for="brand" className="block mb-2 md:text-sm text-xs font-medium text-gray-900 dark:text-white">Please Select The Course</label>
//                                     <select
//                                         onChange={handleChange} value={credentials.course}
//                                         id="brand" name="course" className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="">
//                                         {courses.length === 0 ? <option value="">No Courses Found</option> :
//                                             courses.map((course) => (
//                                                 <option key={course._id} value={course._id}>{course.courseName}</option>
//                                             ))}
//                                     </select>

//                                 </div>

//                                 <div className="sm:col-span-2">
//                                     <label for="brand" className="block mb-2 md:text-sm text-xs font-medium text-gray-900 dark:text-white">Enter Duration</label>
//                                     <input onChange={handleChange} type="number" value={credentials.duration} name="duration" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter duration" required="" />
//                                 </div>

//                                 <div className="sm:col-span-2">
//                                     <label for="brand" className="block mb-2 md:text-sm text-xs font-medium text-gray-900 dark:text-white">Are you creating a new lecture or resuming attendance of previous one?</label>
//                                     <select onChange={handleChange} value={credentials.lecture} name="lecture"
//                                         id="lecture" className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
//                                         <option selected="">Select option</option>
//                                         <option value="true">New Lecture</option>
//                                         <option value="false">Resume Previous Lecture</option>
//                                     </select>

//                                 </div>
//                             </div>
//                             <div className="text-center ">
//                                 <button type="submit" className="mt-4 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5">
//                                     Start Session
//                                 </button>
//                             </div>
//                         </form>

//                     </div>
//                 </div>
//             </div>}



//         </>
//     )
// }

// export default Take_Attendance
