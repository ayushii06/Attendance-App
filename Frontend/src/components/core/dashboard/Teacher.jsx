import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import TakeAttendance from '../attendance/Take_Attendance'
import { getAllCourses } from '../../../services/operations/courseAPI'
import { getAllBranches } from '../../../services/operations/branchAPI'

import { useSelector } from 'react-redux'

const Teacher = () => {
    const navigate = useNavigate()

    const user = useSelector((state) => state.profile.user)
    const id = useSelector((state) => state.profile.user?._id || "")
    const token = useSelector((state) => state.auth.token)
    // console.log("Token", token)
    const firstName = user?.firstName|| ""
    const lastName = user?.lastName || ""
    const [branch, setBranch] = useState('cse')
    const [year, setYear] = useState('1')
    const [courses, setCourses] = useState([])
    const [branches, setBranches] = useState([])

    const getBranches = async () => {
        const res = await getAllBranches(year, token)
        setBranches(res)
    }

    useEffect(() => {
        getBranches()
    }, [year])

    // useEffect(() => {
    //     const getBranches = async () => {
    //         try {
    //             const res = await axios.post('http://localhost:4000/api/v1/branch/showAllBranch',{
    //                 year
    //             }, {
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             })
    //             if (res.status === 200) {
    //                 console.log(res.data)
    //                 setBranches(res.data.allBranch)
    //             }
    //             else {
    //                 console.log('Error')
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     getBranches()
    // }, [year])
    const [takeattendance, setTakeAttendance] = useState(false)
    
    const teacher_course = courses.filter(course => course.instructor._id === id) || []

    // console.log(teacher_course)

    const getAllCourse = async () => {
        const res = await getAllCourses(branch,token)
        setCourses(res)
    }

    // const getAllCourses = async () => {
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/course/getAllCourses',
    //             { branchId: branch },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             }

    //         )
    //         if (res.status === 200) {
    //             console.log(res.data)
    //             setCourses(res.data.branch.courses)
    //         }
    //         else {
    //             console.log('Error')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        getAllCourse()
    }, [branch])

    const handleAttendanceClick = () => {
        setTakeAttendance(true)
    }

    return (
        <>
            {takeattendance ? <TakeAttendance

            /> : <div className=""><div className='mx-12 my-6'>
                <div className="flex justify-between mb-12">
                    <p className="font-medium text-white text-3xl">Welcome <b> Dr. {firstName} {lastName} !</b></p>
                    <button onClick={handleAttendanceClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Take Attendance</button>

                </div>

                    <p className="text-center text-2xl font-bold mb-10">View All Your Courses</p>
                <div className="mx-12 my-5 flex gap-5 items-center">
                    <select
                        id="category"
                        onChange={(e) => setYear(e.target.value)}
                        value={year}
                        className="border-white border-2 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-44 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>

                    <select
                        id="category"
                        onChange={(e) => setBranch(e.target.value)}
                        value={branch}
                        className="border-white border-2 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-44 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>{branch.name}</option>
                        ))}


                    </select>
                </div>


                <div className="flex flex-wrap  mx-12 justify-start items-center my-12">
                    {
                        teacher_course.length === 0 ? (
                            <div className="text-center text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-10">
                                No Courses Found
                            </div>
                        ) : teacher_course.map((course) => (
                            <div key={course._id} className="w-4/12 text-center py-2 px-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                                <h5 className="mb-2 my-2 text-2xl font-semibold tracking-tight text-white">
                                    {course.courseName}
                                </h5>
                                <div className=" my-4 mx-auto bg-white text-black py-2 w-6/12 rounded-md font-bold">
                                    Academic Year - {course.year}
                                </div>
                                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{course.courseDescription.slice(0,150)}....</p>
                                <p className="mb-3 font-bold text-white ">Total lectures - {course.lectures}</p>
                                <p className="mb-6 text-lg font-normal underline text-orange-600 ">Total branch enrolled - {course.branch.length}</p>

                                <button onClick={() => navigate(`/getAttendance/${course.year}/${course._id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">View Attendance</button>


                            </div>
                        ))

                    }
                </div>





            </div></div>}


        </>
    )
}

export default Teacher
