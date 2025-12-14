// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react'
// import { useEffect } from 'react'
// import TakeAttendance from '../../../pages/Take_Attendance'
// import { getAllCourses } from '../../../services/operations/courseAPI'
// import { getAllBranches } from '../../../services/operations/branchAPI'
// import { IoSettingsOutline } from 'react-icons/io5'
// import { CiLogout } from 'react-icons/ci'
// import EditProfile from './ProfileSettings/EditProfile'
// import { useDispatch } from 'react-redux'
// import { logout } from '../../../services/operations/authAPI'


// import { useSelector } from 'react-redux'
// import { ACCOUNT_TYPE } from '../../../utils/constants'

// const Teacher = () => {
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const [modal, setModal] = useState(false)
//     const user = useSelector((state) => state.profile.user)
//     const id = useSelector((state) => state.profile.user?._id || "")
//     const token = useSelector((state) => state.auth.token)
//     // console.log("Token", token)
//     const firstName = user?.firstName || ""
//     const lastName = user?.lastName || ""
//     const [branch, setBranch] = useState('cse')
//     const [year, setYear] = useState('1')
//     const [courses, setCourses] = useState([])
//     const [branches, setBranches] = useState([])

//     const getBranches = async () => {
//         const res = await getAllBranches(year, token)
//         setBranches(res)
//     }

//     useEffect(() => {
//         getBranches()
//     }, [year])

//     // useEffect(() => {
//     //     const getBranches = async () => {
//     //         try {
//     //             const res = await axios.post('http://localhost:4000/api/v1/branch/showAllBranch',{
//     //                 year
//     //             }, {
//     //                 headers: {
//     //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//     //                 }
//     //             })
//     //             if (res.status === 200) {
//     //                 console.log(res.data)
//     //                 setBranches(res.data.allBranch)
//     //             }
//     //             else {
//     //                 console.log('Error')
//     //             }
//     //         } catch (error) {
//     //             console.log(error)
//     //         }
//     //     }
//     //     getBranches()
//     // }, [year])
//     const [takeattendance, setTakeAttendance] = useState(false)

//     const teacher_course = courses.filter(course => course.instructor._id === id) || []

//     // console.log(teacher_course)

//     const getAllCourse = async () => {
//         const res = await getAllCourses(branch, token)
//         setCourses(res)
//     }

//     // const getAllCourses = async () => {
//     //     try {
//     //         const res = await axios.post('http://localhost:4000/api/v1/course/getAllCourses',
//     //             { branchId: branch },
//     //             {
//     //                 headers: {
//     //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//     //                 }
//     //             }

//     //         )
//     //         if (res.status === 200) {
//     //             console.log(res.data)
//     //             setCourses(res.data.branch.courses)
//     //         }
//     //         else {
//     //             console.log('Error')
//     //         }
//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // }

//     useEffect(() => {
//         getAllCourse()
//     }, [branch])

//     const handleAttendanceClick = () => {
//         setTakeAttendance(true)
//     }

//     return (
//         <>
//             {takeattendance ? <TakeAttendance

//             /> : <div className=""><div className='mx-4 md:mx-12 my-8'>
//                 <div className="flex md:flex-row flex-col gap-5 md:gap-0 my-4 justify-between items-center">
//                     <div className="md:text-2xl text-lg text-white font-bold text-center">Welcome, Dr. {firstName} {lastName}!</div>
//                     <div className="flex flex-wrap justify-center items-center gap-2">
//                         <button
//                             onClick={handleAttendanceClick}
//                             className="block text-white bg-black hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5"
//                         >
//                             Start Attendance
//                         </button>

//                         {token !== null && (
//                             <>
//                                 <button onClick={() => {
//                                     setModal(true)
//                                 }} className="flex items-center gap-2 text-white bg-black hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5">
//                                     <IoSettingsOutline />
//                                     Settings
//                                 </button>
//                                 <button onClick={() => dispatch(logout(navigate))} className="flex items-center gap-2 text-white bg-black hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5">
//                                     <CiLogout />
//                                     Log Out
//                                 </button>
//                             </>

//                         )}


//                         {modal && (
//                             <div
//                                 className="fixed top-0 left-0 z-50
//                                             bg-black bg-opacity-95
//                                              p-4 w-full h-full"
//                             >
//                                 <EditProfile accountType={ACCOUNT_TYPE.INSTRUCTOR} setModal={setModal} branch={branch} courses={courses} />
//                             </div>

//                         )}
//                     </div>

//                 </div>

//                 <p className="text-center md:text-2xl text-lg font-bold my-10">View All Your Courses</p>
//                 <div className="mx-4 my-5 flex-wrap flex gap-5 items-center justify-center">
//                     <select
//                         id="category"
//                         onChange={(e) => setYear(e.target.value)}
//                         value={year}
//                         className="border-white border-2 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full sm:w-44 md:w-44 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//                     >
//                         <option value="">Select Year</option>
//                         <option value="1">1st Year</option>
//                         <option value="2">2nd Year</option>
//                         <option value="3">3rd Year</option>
//                         <option value="4">4th Year</option>
//                     </select>

//                     <select
//                         id="category"
//                         onChange={(e) => setBranch(e.target.value)}
//                         value={branch}
//                         className="border-white border-2 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full sm:w-44 md:w-44 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//                     >
//                         <option value="">Select Branch</option>
//                         {branches.map((branch) => (
//                             <option key={branch._id} value={branch._id}>{branch.name}</option>
//                         ))}


//                     </select>
//                 </div>


//                 <div className="flex flex-wrap  mx-12 justify-center items-center my-12">
//                     {
//                         teacher_course.length === 0 ? (
//                             <div className="text-center text-sm md:text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-10">
//                                 No Courses Found
//                             </div>
//                         ) : teacher_course.map((course) => (
//                             <div key={course._id} className="md:w-6/12 text-center py-2 px-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

//                                 <h5 className="mb-2 my-2 text-sm md:text-2xl font-semibold tracking-tight text-white">
//                                     {course.courseName}
//                                 </h5>
//                                 <div className="text-xs md:text-2xl my-4 mx-auto bg-white text-black py-2 md:w-6/12 rounded-md font-bold px-2">
//                                     Academic Year - {course.year}
//                                 </div>
//                                 <p className="mb-3 text-xs md:text-sm text-gray-500 dark:text-gray-400">{course.courseDescription.slice(0, 150)}....</p>
//                                 <p className="mb-3 text-xs md:text-2xl font-bold text-white ">Total lectures - {course.lectures}</p>
//                                 <p className="mb-6 text-xs md:text-lg font-normal underline text-orange-600 ">Total branch enrolled - {course.branch.length}</p>

//                                 <button onClick={() => navigate(`/getAttendance/${course.year}/${course._id}`)} className="text-xs md:text-sm  bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5">View Attendance</button>


//                             </div>
//                         ))

//                     }
//                 </div>





//             </div></div>}


//         </>
//     )
// }

// export default Teacher
