import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCrosshair } from 'react-icons/fi';
import {useCreateBranchMutation,useGetBranchesByYearMutation} from '../../../services/branchApi'
import { useGetCoursesMutation } from '../../../services/courseApi';
import { useEffect } from 'react';


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

const ManageBranches = () => {
    const [allCourses, setAllCourses] = useState(
        {
            1: [],
            2: [],
            3: [],
            4: [],
        }
    );
    const [branchList, setBranchList] = useState([]);
    const [branchName, setBranchName] = useState('');
    const [desc, setDesc] = useState('');
    const [year, setYear] = useState('');

    
    
    
    // State to track if a year is active for this branch
    const [activeYears, setActiveYears] = useState({
        1: true,
        2: true,
        3: true,
        4: true,
    });
    const [openDialog, setOpenDialog] = useState(false);
    
    // State to hold the selected course IDs for each year
    const [selectedCourses, setSelectedCourses] = useState({
        1: [], 2: [], 3: [], 4: [],
    });
    
    const [getBranch, { isLoading: isGettingBranches }] = useGetBranchesByYearMutation();
    const [getCourse, { isLoading: isGettingCourses }] = useGetCoursesMutation();
    const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                for (let year = 1; year <= 4; year++) {
                    const courses = await getCourse({year}).unwrap();
                    console.log("Courses for year", year, courses);
                    setAllCourses(prev => ({ ...prev, [year]: courses }));

                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        if(openDialog){
            fetchCourses();

        }
    }, [openDialog]);

    // Handler to toggle a year's availability
    const handleYearToggle = (year, isActive) => {
        setActiveYears(prev => ({ ...prev, [year]: isActive }));
        // If a year is deactivated, clear its selected courses
        if (!isActive) {
            setSelectedCourses(prev => ({ ...prev, [year]: [] }));
        }
    };

    // Handler for course checkbox selection
    const handleCourseSelection = (courseId, year) => {
        setSelectedCourses(prev => {
            const currentCourses = prev[year];
            const isSelected = currentCourses.includes(courseId);
            const newCourses = isSelected
                ? currentCourses.filter(id => id !== courseId) // Uncheck: remove from array
                : [...currentCourses, courseId]; // Check: add to array
            return { ...prev, [year]: newCourses };
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const curriculum = Object.entries(selectedCourses)
            .filter(([year, courses]) => activeYears[year]) // Only include active years
            .map(([year, courses]) => ({
                year: parseInt(year),
                courses: courses,
            }));

        if (!branchName || !desc) {
            toast.error("Branch name and description are required.");
            return;
        }

        const newBranchData = { name: branchName, description:desc, curriculum };
        
        try {
            await createBranch(newBranchData).unwrap();
            toast.success("Branch created successfully!");
            setBranchName('');
            setDesc('');
            setYear('');
            setSelectedCourses({
                1: [],
                2: [],
                3: [],
                4: [],
            });
            setOpenDialog(false);
            // Reset form
        } catch (err) {
            toast.error("Failed to create branch.");
        }
    };

     const handleFindBranch = async (e) => {
            e.preventDefault();
    
            try {
                
                const result = await getBranch({ year }).unwrap();
                console.log("Branch fetched:", result);
                setBranchList(result);
    
            } catch (error) {
                toast.error("Failed to fetch branch.");
            }
        }



     // --- Reusable Tailwind classes for inputs and select dropdowns ---
      const formFieldStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5";

      const YearCourseSelector = ({ y }) => (
        <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">Year {y}</p>
            <div className="flex space-x-4 mb-3">
                <label className="flex items-center">
                    <input type="radio" name={`year-${y}-active`} checked={activeYears[y]} onChange={() => handleYearToggle(y, true)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name={`year-${y}-active`} checked={!activeYears[y]} onChange={() => handleYearToggle(y, false)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
            </div>

            <div className={`transition-opacity duration-300 ${activeYears[y] ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                 <label className="block text-sm font-medium text-gray-700">Select Courses</label>
                 <div className="mt-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white space-y-1">
                    {isGettingCourses ? <p className="text-sm text-gray-500">Loading...</p> :
                    allCourses[y].length === 0 ? <p className="text-sm text-gray-500">No courses available.</p> :
                     allCourses[y].map(course => (
                        <label key={course._id} className="flex items-center w-full px-2 py-1 rounded hover:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={selectedCourses[y].includes(course._id)}
                                onChange={() => handleCourseSelection(course._id, y)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-800">{course.courseName}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
    return (
        <div>
            {openDialog && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center   z-50">
                    <div className="bg-white w-[60%] h-[80%] overflow-y-scroll p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                              
                        <h2 className="text-xl text-black font-semibold mb-4">Add New Branch</h2>
                        <FiCrosshair className="h-6 w-6 text-black cursor-pointer  top-4 right-4" onClick={()=>{setOpenDialog(!openDialog)}} />
                        </div>
                        <form onSubmit={handleSubmit} className="grid  grid-cols-1 gap-4 items-end">
                            
                            <div className="md:col-span-1">
                                <label className="block text-md mb-2 font-medium text-gray-700">Branch Name

                                <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={branchName}
                                    onChange={(e) => setBranchName(e.target.value)}
                                    className={formFieldStyle}
                                    placeholder="e.g., Civil Engineering"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-md mb-2 font-medium text-gray-700">Branch Description

                                <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className={formFieldStyle}
                                    placeholder="e.g., This branch focuses on..."
                                />
                            </div>

                            {/* Year with their courses in one row*/}
                            

                            {/* Course Selection for each year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <YearCourseSelector y={1} />
                    <YearCourseSelector y={2} />
                    <YearCourseSelector y={3} />
                    <YearCourseSelector y={4} />
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isCreating} className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                        {isCreating ? 'Creating...' : 'Create Branch'}
                    </button>
                </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Branches</h1>

                <div className="w-[40%]">
                    <button onClick={()=>{setOpenDialog(!openDialog)}} disabled={isCreating} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                        Add Branch
                    </button>
                </div>
            </div>

            <form onSubmit={handleFindBranch} className="flex items-end gap-4 justify-evenly ">
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

            {isGettingBranches ? (
                <p className='text-black font-bold text-2xl text-center my-32'>Loading...</p>
            ) : branchList?.length === 0 ? (
                <p className='text-black font-bold text-2xl text-center my-32'>No branches found.</p>
            ) : (

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-12'>
                    {branchList?.map((branch) => (
                        // Each card is a single linkable element for better accessibility
                        <div key={branch._id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 flex flex-col">

                            {/* Course Content */}
                            <div className="p-5 flex-grow flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {branch.name}
                                </h2>

                                {/* Description */}
                                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-3">
                                    {branch.description}
                                </p>
                                {/* Instructor Info */}
                                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <UserIcon />
                                    <span>Total Students - {branch.totalStudents}</span>
                                </div>


                                {/* Lectures Info - Placed at the bottom */}
                                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <BookOpenIcon />
                                    <span>Total Courses - {branch.totalCourses}</span>
                                </div>
                            </div>

                           
                        </div>
                    ))}
                </div>
            )}

            
           
        </div>
    );
};

export default ManageBranches;
