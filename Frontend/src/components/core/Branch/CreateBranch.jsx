import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBranch } from '../../../services/operations/branchAPI'

const CreateBranch = () => {

  const [credentials, setCredentials] = useState({
    name: '',
    year: '',
    description: ''
  })

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const token = localStorage.getItem('token')

  const dispatch = useDispatch()
  const createBranches = async (e) => {
    e.preventDefault()
    await createBranch(credentials.name, credentials.year, credentials.description, token)

  }

  // const createBranch = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const res = await axios.post('http://localhost:4000/api/v1/branch/createBranch',
  //       credentials,
  //       {
  //         headers:{
  //             'Content-Type':'application/json',
  //             'Authorization':`Bearer ${token}`
              
  //         }}
      
  //     )
  //     console.log(res)
  //     if(res.status === 200){
  //       alert('Branch created successfully')
  //     }
  //     else{
  //       alert('Error')
  //     }

      
  //   } catch (error) {
  //     alert('Error while creating branch')
  //   }
  // }

  return (
    <div className="items-center py-4 flex justify-center">
      <div className="bg-white w-6/12 px-12 dark:bg-gray-900">
      <div className="py-8 px-4  ">
      <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 dark:text-white">Add a new Branch</h2>
      <form action="#">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Branch Name</label>
                  <input type="text" value={credentials.name} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type branch name" required="" onChange={handleChange}/>
              </div>
              
              
              <div>
                  <label for="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                  <select onChange={handleChange} name="year" value={credentials.year} id="year" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected="">Select year</option>
                      <option value="1">1st</option>
                      <option value="2">2nd</option>
                      <option value="3">3rd</option>
                      <option value="4">4th</option>
                  </select>
              </div>
              
              <div className="sm:col-span-2">
                  <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                  <textarea onChange={handleChange} name= "description" value={credentials.description} id="description" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
              </div>
          </div>
          <div className="text-center">
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-black bg-white rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800" onClick={createBranches}>
              Add Branch
          </button>
          </div>
      </form>
  </div>
</div>
</div>

  )
}

export default CreateBranch
