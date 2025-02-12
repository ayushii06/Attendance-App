import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getAllCourses } from '../../../services/operations/courseAPI'
import { getAllBranches } from '../../../services/operations/branchAPI'


const GetAllCourses = () => {

  const [ branches, setBranches ] = useState([]);
  const [year, setYear] = useState('1')
  const [branch, setBranch] = useState('')

  // const getAllBranches = async () => {
  //   try {
  //     const res = await axios.post('http://localhost:4000/api/v1/branch/showAllBranch',
  //       { year },

  //       {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         }
  //       }
  //     )
  //     if (res.status === 200) {
  //       console.log(res.data)
  //       setBranches(res.data.allBranch)
  //     }
  //     else {
  //       console.log('Error')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const token = useSelector(state => state.auth.token)

  console.log("Token", token)
  const getAllBranch = async () => {
    const res = await getAllBranches(year,token);
    setBranches(res);
  }


  useEffect(() => {
    getAllBranch()
  }, [year])


  const [courses, setCourses] = useState([])

  const navigate = useNavigate()

  // const getCourses = async () => {
  //   try {
  //     const res = await axios.post('http://localhost:4000/api/v1/course/getAllCourses',
  //       { branchId: branch },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         }
  //       }
  //     )
  //     if (res.status === 200) {
  //       console.log(res.data)
  //       setCourses(res.data.branch.courses)
  //     }
  //     else {
  //       console.log('Error')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


   const getCourses = async () => {
          const res = await getAllCourses(branch,token);
          setCourses(res);
      }

  const handleCreate = () => {
    navigate('/create_course')
  }

  useEffect(() => {
    if (year && branch) getCourses();
  }, [year, branch]);
  


  return (
    <div>
      <div className="flex justify-between items-center mx-14 my-5">
        <div className="font-bold text-lg">Showing {courses.length} results</div>
        <button
          type="button"
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          onClick={handleCreate}
        >
          Create New Course
        </button>
      </div>
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
      {
        courses.length === 0 ? (
          <div className="text-center text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-10">
            No Courses Found
          </div>
        ) : <div className="flex flex-wrap gap-16 justify-center items-center py-12 mx-12 text-center">
          {courses.map((course) => (
            <div key={course._id} className="w-4/12 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-light text-gray-600 dark:text-gray-400">{branch.year}</span>
              </div>
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {course.courseName
                }
              </h5>
              <p className="mb-3 text-lg py-2 font-bold text-gray-500 dark:text-gray-400">INSTRUCTOR - Dr. {course.instructor.firstName } {course.instructor.lastName}</p>
              <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">Total lectures - {course.lectures}</p>
  </div>
          ))}

        </div>
      }




    </div>
  )
}

export default GetAllCourses
