import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCrosshair } from 'react-icons/fi';
import { useGetInstructorQuery } from '../../../services/authApi';
import { useCreateCourseMutation, useGetCoursesMutation } from '../../../services/courseApi';


const UserIcon = () => (
    <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const BookOpenIcon = () => (
    <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v12h6V4H7z" />
        <path d="M10 14a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);


const ManageCourses = () => {
    // const /
    const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
    const [getCourse, { isLoading: isGetting }] = useGetCoursesMutation();
    const { data: Instructor, isLoading: isLoadingInstructor, isError: isInstructorError } = useGetInstructorQuery();

    const instructor = Instructor || [];
    const years = [
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
    ]

    const [openDialog, setOpenDialog] = useState(false);

    const [courseName, setCourseName] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [year, setYear] = useState('');
    const [learn, setLearn] = useState('');
    const [lectures, setLectures] = useState('');
    const [branch, setBranch] = useState('');
    const [courses, setCourses] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const lec = parseInt(lectures);
        const y = parseInt(year);

        const newCourseData = { courseName, courseDescription: desc, instructor: selectedInstructor, whatYouWillLearn: learn, year: y, lectures: lec };

        console.log("new course data", newCourseData);
        try {
            const result = await createCourse(newCourseData).unwrap();
            console.log("Course created:", result);
            setOpenDialog(false);
            setCourseName('');
            setDesc('');
            setSelectedInstructor('');
            setYear('');
            setLearn('');
            setLectures('');
            setBranch('');
            toast.success("Course created successfully!");
        } catch (err) {
            toast.error("Failed to create course.");
        }
    }

    const handleFindCourses = async (e) => {
        e.preventDefault();

        try {
            const result = await getCourse({ year }).unwrap();
            console.log("Courses fetched:", result);
            setCourses(result);

        } catch (error) {
            toast.error("Failed to fetch courses.");
        }
    }

    const formFieldStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5";


    return (
        <>
            <div className="flex justify-between items-center mb-8">
                {openDialog && <>
                    <form onSubmit={handleSubmit} className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center   z-50">
                        <div className="bg-white w-[60%] h-[80%] overflow-y-scroll p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">

                                <h2 className="text-xl text-black font-semibold mb-4">Add New Course</h2>
                                <FiCrosshair className="h-6 w-6 text-black cursor-pointer  top-4 right-4" onClick={() => { setOpenDialog(!openDialog) }} />
                            </div>
                            <div className="grid  grid-cols-1 gap-4 items-end">

                                <div className="md:col-span-1">
                                    <label className="block text-md mb-2 font-medium text-gray-700">Course Name

                                        <span className='text-red-500 ml-1'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        className={formFieldStyle}
                                        placeholder="e.g., Civil Engineering"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-md mb-2 font-medium text-gray-700">Course Description

                                        <span className='text-red-500 ml-1'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        className={formFieldStyle}
                                        placeholder="e.g., This course focuses on..."
                                    />
                                </div>


                                <div className="md:col-span-1">
                                    <label className="block text-md mb-2 font-medium text-gray-700">Instructor</label>
                                    <select
                                        value={selectedInstructor}
                                        onChange={(e) => setSelectedInstructor(e.target.value)}
                                        className={formFieldStyle}
                                    >
                                        <option value="">Select Instructor</option>
                                        {instructor.map((i) => (
                                            <option key={i.id} value={i._id}>
                                                {i.firstName} {i.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-md mb-2 font-medium text-gray-700">Year</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className={formFieldStyle}
                                    >
                                        <option value="">Select Year</option>
                                        {years.map((i) => (
                                            <option key={i.id} value={i.id}>
                                                {i.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-md mb-2 font-medium text-gray-700">What will you learn

                                        <span className='text-red-500 ml-1'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={learn}
                                        onChange={(e) => setLearn(e.target.value)}
                                        className={formFieldStyle}
                                        placeholder="e.g., This course focuses on..."
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-md mb-2 font-medium text-gray-700">No of Lectures
                                        <span className='text-red-500 ml-1'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={lectures}
                                        onChange={(e) => setLectures(e.target.value)}
                                        className={formFieldStyle}
                                        placeholder="e.g., 10"
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={isCreating} className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                                        {isCreating ? 'Creating...' : 'Create Course'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </>}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Courses</h1>

                <div className="w-[40%]">
                    <button onClick={() => { setOpenDialog(!openDialog) }} disabled={openDialog} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                        Add Course
                    </button>
                </div>
            </div>

            <form onSubmit={handleFindCourses} className="flex items-end gap-4 justify-evenly ">
                <div className="md:col-span-1 w-[80%]">

                    <label className="block mb-2 text-sm font-medium text-gray-900">Year <span className="text-red-500">*</span></label>
                    <select name="year" value={year} onChange={(e) => setYear(e.target.value)} className={formFieldStyle} required>
                        <option value="" disabled>Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>

                </div>
                <button type='submit' className='w-[30%]'>Find</button>
            </form>

            {isGetting && <p className='text-black font-bold text-2xl text-center my-32'>Loading...</p>}


            {courses.length === 0 ? (
                <p className='text-black font-bold text-2xl text-center my-32'>No courses found.</p>
            ) : (

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-12'>
                    {courses.map((course) => (
                        // Each card is a single linkable element for better accessibility
                        <div key={course._id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 flex flex-col">

                            {/* Course Content */}
                            <div className="p-5 flex-grow flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {course.courseName}
                                </h2>

                                {/* Instructor Info */}
                                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <UserIcon />
                                    <span>{course.instructor.firstName} {course.instructor.lastName}</span>
                                </div>

                                {/* Description */}
                                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-3">
                                    {course.courseDescription}
                                </p>

                                {/* Lectures Info - Placed at the bottom */}
                                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <BookOpenIcon />
                                    <span>{course.lectures} Lectures</span>
                                </div>
                            </div>

                           
                        </div>
                    ))}
                </div>
            )}

        </>
    );
};

export default ManageCourses;
