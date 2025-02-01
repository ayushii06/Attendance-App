import React, { useState, useEffect } from 'react'
import { getAllBranches,getBranchDetail } from '../../../services/operations/branchAPI'
import { getCourseAttendance, getLectureDatesByCourse } from '../../../services/operations/attendanceAPI'
import { useSelector } from 'react-redux'

const GetAttendance = () => {
    const year = window.location.pathname.split('/')[2]
    const course_id = window.location.pathname.split('/')[3]
    const [branches, setBranches] = useState([])
    const [branch, setBranch] = useState('')
    const [attendance, setAttendance] = useState([])
    const token = useSelector(state => state.auth.token)
    const [students, setStudents] = useState([])
    const [dates, setDates] = useState([])

    const getAllStudents = async () => {
        const res = await getBranchDetail(branch,token);
        console.log("students", res)
        setStudents(res.students)
    }

    // const getAllStudents = async () => {
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/branch/showBranchDetails',
    //             {
    //                 branchId: branch,
    //             },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             }
    //         )
    //         if (res.status === 200) {
    //             setStudents(res.data.branch.students)

    //         }
    //         else {
    //             console.log('Error')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const totalAttendanceSessions = async () => {
        const res = await getLectureDatesByCourse(course_id,token)
        setDates(res)
    }

    // const totalAttendanceSessions = async () => {
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/attendance/getLectureDatesByCourse',
    //             {
    //                 course: course_id,
    //             },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             }
    //         )
    //         if (res.status === 200) {

    //             setDates(res.data.data)
    //             console.log("dates", res.data.data)
    //         }
    //         else {
    //             console.log('Error')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        totalAttendanceSessions()
    }, [course_id])

    function datetoISt(input) {
        const date = new Date(input);

        // Format only the date part in IST
        const formattedIST = date.toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
        });

        return formattedIST;
    }

    const getAllBranch = async () => {
        const res = await getAllBranches(year, token)
        setBranches(res)
    }

    // const getAllBranches = async () => {
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/branch/showAllBranch',
    //             { year },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             }
    //         )
    //         if (res.status === 200) {
    //             console.log(res.data)
    //             setBranches(res.data.allBranch)
    //         }
    //         else {
    //             console.log('Error')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        getAllBranch()
    }, [year])

    useEffect(() => {
        getAttendance()
    }, [branch])

    useEffect(() => {
       if(branch){
        getAllStudents()
       }
    }, [branch])

    const getAttendance = async () => {
        const res = await getCourseAttendance(course_id, year, branch,token)
        setAttendance(res)
    }

    // const getAttendance = async () => {
    //     console.log(course_id, year, branch)
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/attendance/getCourseAttendance', {
    //             course: course_id,
    //             year: year,
    //             branch: branch
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //         console.log(res)
    //         if (res.status === 200) {
    //             setAttendance(res.data.normalizedRecords)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         console.error('Error fetching attendance:', error.message)
    //     }
    // }

    console.log("attendance", attendance)
    return (
        <div>
            <div className="w-2/3 mx-auto">
                <form className='flex items-center justify-center gap-16' onSubmit={(e) => e.preventDefault()}>
                    <label className="text-white w-1/3 text-2xl font-bold">Select a branch</label>
                    <select
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full p-2.5 bg-gray-600 border rounded-lg"
                    >
                        <option value="">Select a branch</option>
                        {branches?.map((branch) => (
                            <option key={branch._id} value={branch._id}>{branch.name}</option>
                        ))}
                    </select>

                </form>
            </div>
            {students?.length > 0 ? <>


                <div className="relative mx-auto my-12 rounded-lg overflow-auto w-10/12">
                    <table className="min-w-[800px] table-auto mx-auto w-10/12 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                        <thead className="text-sm text-white uppercase " style={{"background":"rgb(0 19 140)"}}>
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STUDENT NAME
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    ROLL NO
                                </th>

                                {
                                    dates?.map((date) => (
                                        <th scope="col" className="px-6  py-3 whitespace-nowrap">
                                            <p className="">{date.date}</p>
                                            <p className="">{date.lectureNo ? `Lecture ${date.lectureNo}` : ''}</p>
                                        </th>
                                    ))
                                }


                                <th scope="col" className="px-6 py-3">
                                    TOTAL
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    PERCENTAGE
                                </th>

                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {students?.map((student) => {
                                return <tr key={student._id} className="bg-white " style={{"background":"rgb(4 19 41)"}}>
                                    <td className="px-6 py-4 whitespace-nowrap"  >
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {student.firstName}  {student.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-200">{student.rollNo}</div>
                                    </td>

                                    {
                                        dates.map((date) => {
                                            const record = attendance.find((record) => record.userId._id === student._id && datetoISt(record.date) === datetoISt(date.date))
                                            return <td className="px-6 py-4 whitespace-nowrap" >
                                                <div className="text-sm text-gray-900 dark:text-gray-200" >
                                                    {record ? record.mark ? <div className="text-green-500 font-medium">Present</div> :
                                                        <div className="
                                                    text-red-500 font-medium
                                                    ">Absent</div>
                                                        :
                                                        <div className="
                                                    text-red-500 font-medium">Absent</div>}
                                                </div>
                                            </td>
                                        }
                                        )
                                    }

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-200">{attendance.filter((record) => record.userId._id === student._id && record.mark).length}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-200">{Math.floor(dates.length === 0 ? 0 : (attendance.filter((record) => record.userId._id === student._id && record.mark).length / dates.length) * 100)}%</div>
                                    </td>
                                
                                </tr>


                            }
                            )}

                        </tbody>

                    </table>
                </div>

            </>:<>
            <div className="text-center text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-10">
                No Students Found
            </div>
            </>}
        </div>
    )
}


export default GetAttendance
