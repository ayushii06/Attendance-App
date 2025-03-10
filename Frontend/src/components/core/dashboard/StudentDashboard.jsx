import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../../services/operations/courseAPI';
import { getStudentAttendanceByCourse } from '../../../services/operations/attendanceAPI';
import dateToIST from '../../../utils/datetoIST';
import VerifyFace from '../../../pages/VerifyFace'
import VerifyAttendance from '../../../pages/VerifyAttendance'
import { logout } from '../../../services/operations/authAPI'
import RegisterFace from '../../../pages/RegisterFace'
import EditProfile from '../../core/dashboard/ProfileSettings/EditProfile'
import { IoSettingsOutline } from "react-icons/io5"
import { CiLogout } from "react-icons/ci";
import { RxCross2 } from 'react-icons/rx';
import { ACCOUNT_TYPE } from '../../../utils/constants';


const StudentDashboard = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.profile.user);
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const branch = user?.branch || "";
    const token = useSelector((state) => state.auth.token);
    const [courses, setCourses] = useState([]);
    const [total_lec, setTotal_lec] = useState(0);
    const [attended_lec, setAttended_lec] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourseID, setSelectedCourseID] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [needed_attendance, setNeeded] = useState(0);
    const [per, setPer] = useState(0);
    const [startAttendance, setStartAttendance] = useState(false)
    const [startRecognition, setStartRecognition] = useState(false)

    //Step1 --> Click on Take Attendance and select course --- modal visible
    //Step2 --> Pop up for face recognition start
    //Step3 --> Camera will open and verify face
    //Step4 --> if camera success --> start location verification ----- else start step 1 
    //Step5 --> if location success --> mark attendance ----- else start step 1

    const [step, setStep] = useState(0)

    const getAllCourse = async () => {
        const res = await getAllCourses(branch, token);
        setCourses(res);
    }

    const fetchEnrolledCourses = async (id) => {
        try {
            const res = await getStudentAttendanceByCourse(id, token);
            console.log(res);
            if (res) {
                setEnrolledCourses(res.attendance);
                setTotal_lec(res.noOfLectures)
                setAttended_lec(res.noOfPresent)
                setNeeded(res.neededAttendance);
                setPer(res.attendancePercentage);
                document.getElementById('default-modal').classList.remove('hidden');
            }
            else {
                alert('Error')
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        if (branch) {
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
        setSelectedCourseID(e.target.value);
    };

    const handleTakeAttendance = () => {
        setModalVisible(false)
        setStep(1)
        // setStartAttendance(true)
        // navigate(`/mark_attendance/${selectedCourseID}`);
    };

    const handleStartAttendance = () => {
        setStep(2)
    }

    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)


    return (
        <>
            <div className="mx-12 my-12">
                <div className="flex md:flex-row flex-col gap-5 md:gap-0  justify-between items-center">
                    <div className="md:text-3xl text-lg text-white font-bold text-center">Welcome, {firstName} {lastName}!</div>

                    <div className="flex flex-wrap justify-center items-center gap-2">
                        <button
                            onClick={handleModalToggle}
                            className="block text-white bg-black hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5"
                        >
                            Take Attendance
                        </button>

                        {token !== null && (
                            <>
                                <button onClick={() => {
                                    setModal(true)
                                }} className="flex items-center gap-2 text-white bg-black hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5">
                                    <IoSettingsOutline />
                                    Settings
                                </button>
                                <button onClick={() => dispatch(logout(navigate))} className="flex items-center gap-2 text-white bg-black hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5">
                                    <CiLogout />
                                    Log Out
                                </button>
                            </>

                        )}


                        {modal && (
                            <div
                                className="fixed top-0 left-0 z-50
                        bg-black bg-opacity-95
                         p-4 w-full h-full"
                            >
                                <EditProfile accountType={ACCOUNT_TYPE.STUDENT} setModal={setModal} branch={branch} courses={courses}/>
                            </div>

                        )}
                    </div>

                </div>

                {modalVisible && (
                    <div
                        className="fixed top-0 left-0
                        bg-black bg-opacity-50
                         z-10 p-4 w-full h-full"
                    >
                        <div className="sm:w-96 
                        md:w-96 mx-auto my-40
                        bg-white dark:bg-gray-800
                        p-4 rounded-lg shadow-lg
                        dark:shadow-dark-lg
                        dark:text-gray-400

                        ">
                            <div className="flex justify-between items-center mb-4 z-50">
                                <h3 className="md:text-lg text-xs font-semibold">Select Course</h3>
                                    <RxCross2 onClick={handleModalToggle}/>
                              
                            </div>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <select
                                    onChange={handleCourseChange}
                                    className="w-full text-xs md:text-sm p-2.5 text-white bg-gray-600 border rounded-lg"
                                >
                                    <option value="">Select a course</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.courseName}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleTakeAttendance}
                                    className="mt-4 text-xs md:text-sm w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5"
                                >
                                    Take Attendance
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div
                        className="fixed top-0 left-0
                     bg-black bg-opacity-90
                      z-10 p-4 w-full h-full"
                    >
                        <div className=" text-center
                     w-10/12 md:w-8/12 mx-auto my-40
                     bg-white dark:bg-gray-800
                     p-4 rounded-lg shadow-lg
                     dark:shadow-dark-lg
                     dark:text-gray-400
 
                     ">
                            <div className="flex justify-center items-start mb-4 z-50">
                                <div className="">
                                    <div className="flex justify-between items-center md:pb-8 md:px-4 ">
                                    <p className="text-lg  md:text-xl text-white font-semibold">Let's verify your face first!</p>
                                    <RxCross2  onClick={()=>{setStep(0)}}/>
                                        </div>
                                    <div className="text-sm md:text-lg font-medium md:font-bold my-4">Please click on the button below and
                                        look straight into the camera without any movements.</div>
                                    <button
                                        className="bg-blue-500 font-semibold text-white px-4 py-2 rounded-md mt-4"
                                        onClick={handleStartAttendance}
                                    >
                                        Verify Face
                                    </button>
                                </div>
                               
                                
                            </div>
                        </div>
                    </div>
                )}


                {step === 2 && (
                    <div
                        className="fixed top-0 left-0
                        bg-black bg-opacity-50
                         z-10 p-4 w-full h-screen"
                    >
                        <VerifyFace course={selectedCourseID} setStep={setStep} />
                    </div>

                )}


                {step === 3 && (
                    <div
                        className="fixed top-0 left-0
                     bg-black bg-opacity-50
                      z-10 p-4 w-full h-full"
                    >
                        <VerifyAttendance course={selectedCourseID} setStep={setStep} />
                    </div>
                )}
                {step === 4 && (<></>)}

                {
                    courses.length === 0 ? (
                        <div className="text-center my-28 font-bold text-3xl ">You are not enrolled in any course!</div>
                    )
                        :
                        <>
                            <div className="text-center my-8 mt-12 font-bold text-lg md:text-2xl underline">Your Enrolled Courses</div>
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs md:text-sm  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3 ">Course Name</th>
                                            <th className="px-6 py-3 ">Instructor</th>
                                            <th className="px-6 py-3 ">Your Attendance</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {courses.map((course) => (
                                            <tr
                                                key={course._id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 text-white dark:hover:bg-gray-600 md:text-sm text-xs"
                                            >
                                                <td className="px-6 py-4 md:text-sm text-xs">{course.courseName}</td>
                                                <td className="px-6 py-4 md:text-sm text-xs">Dr. {course?.instructor?.firstName} {course?.instructor?.lastName}</td>
                                                <td className="px-6 py-4">
                                                    <button data-modal-target="default-modal"
                                                        onClick={() => fetchEnrolledCourses(course._id)}

                                                        data-modal-toggle="default-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                                        View Attendance
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                }




            </div>
            <div id="default-modal" tabIndex="-1" aria-hidden="true"
                className="fixed top-0 left-0 z-50 p-4 w-full h-full bg-black bg-opacity-90 hidden ">
                <div className="w-5/6 md:w-8/12 overflow-x-hidden h-2/3 mx-auto my-24 ">
                    <div className=" bg-black text-white rounded-lg shadow ">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="md:text-2xl text-sm font-semibold text-gray-900 dark:text-white">
                                Your Attendance
                            </h3>
                            
                                
                                <RxCross2 onClick={handleModal2Toggle}/>

                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <div className="flex justify-center items-center gap-16">
                                <p className="md:text-lg text-sm text-center font-medium text-gray-700 dark:text-gray-400">You have attended {attended_lec} lectures till {dateToIST(Date.now())}</p>

                            </div>
                            {attended_lec !== 0 &&
                            <>
                            <div className="text-center font-medium text-xs md:text-lg">
                                Attendance Percentage: {Math.floor(per)}%
                            </div>
                            <div className="text-center font-medium text-xs md:text-lg">
                                Minimum lectures required to attend: {needed_attendance}
                            </div>
                            <div className="my-4 md:my-6 overflow-x-scroll w-full">
                            <table className="md:w-8/12 mx-auto  rounded text-center text-white bg-whit">
                                <thead className="text-xs md:text-lg uppercase " style={{ "background": "rgb(113 113 113)" }}>
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
                                        <tr key={record._id} className=" border-gray-500 md:border-x-2 border-b-2" style={{ "background": "rgb(46 46 46)" }}>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs md:text-sm text-gray-900 dark:text-gray-200">{dateToIST(record.date)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs md:text-sm font-bold text-gray-900 dark:text-gray-200">{record.mark ? <p className="
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
                            </>
                            }

                        </div>
                    </div>
                </div>
            </div></>
    );
};

export default StudentDashboard;
