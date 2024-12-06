import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'


const Take_Attendance = () => {
    const [sesionStarted, setSessionStarted] = useState(false);
    const [expiresAt, setExpiresAt] = useState("")
    const [courses, setCourses] = useState([])
    const [branches, setBranches] = useState([])
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCredentials({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },

                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    function datetoISt(input) {
        const date = new Date(input);

        // Get IST time offset (IST is UTC+5:30)
        const istOffset = 5 * 60 + 30; // 5 hours and 30 minutes in minutes

        // Convert the Date object to IST
        const istDate = new Date(date.getTime() + istOffset * 60 * 1000);

        const formattedIST = istDate.toLocaleString("en-US", {

            dateStyle: "medium",
        });

        return formattedIST;

    }

    function datetoISTwithTime(input){
        const date = new Date(input);

        // Get IST time offset (IST is UTC+5:30)
        const istOffset = 5 * 60 + 30; // 5 hours and 30 minutes in minutes

        // Convert the Date object to IST
        const istDate = new Date(date.getTime() );

        const formattedIST = istDate.toLocaleString("en-US", {
            timeStyle:"medium",
            dateStyle: "medium",
        });

        return formattedIST;
        
    }

    const [credentials, setCredentials] = useState({
        duration: "", course: "", year: "", branch: "", latitude: null, longitude: null, lecture: ""
    })

    const getAllBranches = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/v1/branch/showAllBranch',
                { year: credentials.year },

                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (res.status === 200) {
                setBranches(res.data.allBranch)
            }
            else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllBranches()
    }, [credentials.year])

    const getCourses = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/v1/course/getAllCourses',
                { branchId: credentials.branch },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (res.status === 200) {
                setCourses(res.data.branch.courses)
            }
            else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (credentials.branch) {
            getCourses();
        } else {
            setCourses([]);
        }
    }, [credentials.branch]);


    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (latitude, longitude) => {

        try {
            const res = await axios.post('http://localhost:4000/api/v1/attendance/startAttendance',
                { duration: parseInt(credentials.duration), latitude, longitude, course: credentials.course, year: credentials.year, branch: credentials.branch,
                    newLecture: credentials.lecture == "true"?true:false,
                 },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (res.status === 200) {
                alert(res.data.message)
                setSessionStarted(true)
                setExpiresAt(res.data.session.expiresAt)

            }
            else {
                console.log('Error')
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!credentials.latitude && !credentials.longitude) {
            getLocation();
        }
    }, [credentials.latitude, credentials.longitude]);

    const handleStop = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/v1/attendance/stopAttendance', {
                course: credentials.course,
                year: credentials.year,
                branch: credentials.branch
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }

            })
            
            if (res.status === 200) {
                alert(res.data.message)
                setSessionStarted(false)
            }
            else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdate = async () => {
        try {
            const res = await axios.put('http://localhost:4000/api/v1/attendance/updateAttendanceExpiration', {
                course: credentials.course,
                newDuration: parseInt(credentials.duration),
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }

            })
            if (res.status === 200) {
                alert(res.data.message)
                setExpiresAt(res.data.session.newExpiresAt)
            }
            else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateClick = () => {
        document.getElementById('onUpdate').classList.toggle('hidden')
    }

    return (
        <>
            {sesionStarted ? <div className="text-center mx-12 my-12">
                
                    <div className="text-3xl font-bold my-12">Today's Attendance - {datetoISt(Date.now())}</div>
                    <div className="text-3xl font-bold my-18">Closes at - {datetoISTwithTime(expiresAt)}</div>
                    <button className='bg-blue-500 my-8' onClick={handleUpdateClick}>
                        Update Closing Time
                    </button>
                    <div className="hidden" id='onUpdate'>
                        <input type="text" placeholder="Enter new duration" name="duration" onChange={handleChange} value={credentials.duration} />
                        <button onClick={handleUpdate}>Update</button>
                    </div>
                    <div className="my-12">
                    <div className="my-4">
                        Wants to stop the attendance? Click the button below
                        
                    </div>
                    <button className='bg-blue-500' onClick={handleStop}>Stop Attendance</button>
                
                    </div>

            </div> : <div className="items-center py-4 flex justify-center">
                <div class="bg-white w-6/12 px-12 dark:bg-gray-900">
                    <div class="py-8 px-4  ">
                        <h2 class="mb-4 text-3xl font-bold text-gray-900 text-center my-2 pb-4 dark:text-white">Start Attendance</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(credentials.latitude, credentials.longitude);
                        }}>

                            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                <div class="w-full">
                                    <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter year</label>
                                    <select onChange={handleChange} value={credentials.year} name="year"
                                        id="year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option selected="">Select Year</option>
                                        <option value="1">1st</option>
                                        <option value="2">2nd</option>
                                        <option value="3">3rd</option>
                                        <option value="4">4th</option>
                                    </select>
                                </div>
                                <div class="w-full">
                                    <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Branches</label>
                                    <select onChange={handleChange}
                                        value={credentials.branch} name="branch"
                                        id="branch" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option selected="">Select Branches</option>
                                        {branches.length === 0 ? <option value="">No Branches Found</option> :
                                            branches.map((branch) => (
                                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                                            ))}


                                    </select>
                                </div>

                                <div class="sm:col-span-2">
                                    <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Please Select The Course</label>
                                    <select
                                        onChange={handleChange} value={credentials.course}
                                        id="brand" name="course" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="">
                                        {courses.length === 0 ? <option value="">No Courses Found</option> :
                                            courses.map((course) => (
                                                <option key={course._id} value={course._id}>{course.courseName}</option>
                                            ))}
                                    </select>

                                </div>

                                <div class="sm:col-span-2">
                                    <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Duration</label>
                                    <input onChange={handleChange} type="text" value={credentials.duration} name="duration" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter duration" required="" />
                                </div>

                                <div class="sm:col-span-2">
                                    <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Are you creating a new lecture or resuming attendance of previous one?</label>
                                    <select onChange={handleChange} value={credentials.lecture} name="lecture"
                                        id="lecture" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option selected="">Select option</option>
                                        <option value="true">New Lecture</option>
                                        <option value="false">Resume Previous Lecture</option>
                                    </select>
                                    
                                </div>





                            </div>
                            <div className="text-center ">
                                <button type="submit" class="inline-flex items-center  px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                    Start Session
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>}



        </>
    )
}

export default Take_Attendance
