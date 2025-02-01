import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createCourse } from '../../../services/operations/courseAPI';


const CreateCourse = () => {
    const [ branches, setBranches ] = useState([]);
    const [instructor, setInstructor] = useState([]);
    const [credentials, setCredentials] = useState({
        courseName: '',
        courseDescription: '',
        whatYouWillLearn: "",
        year: "",
        instructor: "",
        lectures: ""
    });

    const token = localStorage.getItem('token')

    useEffect(() => {
        getAllBranches();
    }, [credentials.year]);

    const getAllInstructor = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/v1/auth/getInstructor', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(res);
            if (res.status === 200) {
                setInstructor(res.data.instructor);
            } else {
                console.log('Error');
            }

        } catch (error) {
            console.log(error);
        }
    };
    
    const getAllBranches = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/v1/branch/showAllBranch',{
                year: credentials.year
            },{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(res);
            if (res.status === 200) {
                setBranches(res.data.allBranch);
            } else {
                console.log('Error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBranches();
    }, [credentials.year]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedBranches, setSelectedBranches] = useState([]);

    useEffect(() => {
        getAllBranches();
        getAllInstructor();
    }, []);

    const handleBranchToggle = (branchId) => {
        setSelectedBranches((prevSelected) =>
            prevSelected.includes(branchId)
                ? prevSelected.filter((id) => id !== branchId)
                : [...prevSelected, branchId]
        );
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Handle form field changes
    const handleChange = (e) => {
        
        const { name, value } = e.target;
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                [name]: value
            }));
        
    };

    const course = async (e) => {
        e.preventDefault();
        await createCourse(credentials,token);
    }

    // const course = async (e) => {
    //     e.preventDefault();
        
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/v1/course/createCourse', {
    //             courseName: credentials.courseName,
    //             courseDescription: credentials.courseDescription,
    //             whatYouWillLearn: credentials.whatYouWillLearn,
    //             year: credentials.year,
    //             instructor: credentials.instructor,
    //             lectures: credentials.lectures,
    //             branch: selectedBranches
    //         },
    //         {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             }

    //         }

    //     );

    //     if(res.status === 200){
    //         alert('Course created successfully')
    //     }
    //     else{
    //         alert('Error')
    //     }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <div className="items-center py-4 flex justify-center">
            <div className="bg-white w-6/12 px-12 dark:bg-gray-900">
                <div className="py-8 px-4">
                    <h2 className="mb-10 text-3xl text-center font-bold text-gray-900 dark:text-white">Add a new Course</h2>
                    <form action="#" onSubmit={course}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course Name</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="courseName"
                                    value={credentials.courseName}
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Course Name"
                                    required=""
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What You Will Learn</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="whatYouWillLearn"
                                    value={credentials.whatYouWillLearn}
                                    id="brand"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter learning values"
                                    required=""
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                                <select
                                    onChange={handleChange}
                                    name="year"
                                    value={credentials.year}
                                    id="category"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                >
                                    <option value="">Select year</option>
                                    <option value="1">1st</option>
                                    <option value="2">2nd</option>
                                    <option value="3">3rd</option>
                                    <option value="4">4th</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="instructor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instructor</label>
                                <select
                                    onChange={handleChange}
                                    name="instructor"
                                    value={credentials.instructor}
                                    id="instructor"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                >
                                    <option value="">Select Instructor</option>
                                    {instructor.map((instructor) => (
                                        <option key={instructor._id} value={instructor._id}>
                                            {instructor.firstName} {instructor.lastName}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div>
                                <label htmlFor="lectures" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No. of Lectures</label>
                                <input
                                    onChange={handleChange}
                                    type="number"
                                    name="lectures"
                                    value={credentials.lectures}
                                    id="lectures"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="12"
                                    required=""
                                />
                            </div>

                            <div>
            <label htmlFor="branch" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Branches
            </label>
            <button
                type="button"
                id="dropdownBgHoverButton"
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full p-2.5 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
                <span>{selectedBranches.length > 0 ? `${selectedBranches.length} branches selected` : "Select Branches"}</span>
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isDropdownOpen && (
                <div id="dropdownBgHover" className="z-10 absolute w-60 bg-white rounded-lg shadow dark:bg-gray-700 h-48 overflow-y-auto">
                    <ul className="py-3 px-2 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton">
                        {branches.map((branch) => (
                            <li key={branch._id} className="hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 rounded pl-4 py-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="branch"
                                        value={branch._id}
                                        checked={selectedBranches.includes(branch._id)}
                                        onChange={() => handleBranchToggle(branch._id)}
                                        className="form-checkbox"
                                    />
                                    <span className="text-sm px-2 font-normal">{branch.name}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course Description</label>
                                <textarea
                                    onChange={handleChange}
                                    name="courseDescription"
                                    value={credentials.courseDescription}
                                    id="description"
                                    rows="8"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Your description here"
                                ></textarea>
                            </div>
                        </div>
                        <div className="text-center">
                        <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-black bg-white rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Add Course
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
