import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Take_Image from './Take_Image'

const RegisterStudent = () => {
    const [takeImage,setTakeImage] = useState(false)
    const [credentials,setCredentials] = useState({
        firstName:'',
        lastName:'',
        email:'',
        rollNo:'',
        year:'',
        branch:'',
        accountType:'Student',
        password:'',
        confirmPassword:'',
        otp:''
    })

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]:e.target.value
        })
    }

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:4000/api/v1/auth/signUp',credentials)
            if(res.status === 201){
                alert('Registered Successfully')
                setTakeImage(true)
            }
            else{
                alert(res.data.message)
            }
        } catch (error) {
            alert(error.response.data.message)
        }

    }

  return (
    <>
    {takeImage? <Take_Image id={credentials.rollNo} />:
    <div className="items-center py-4 flex justify-center">
      <div class="bg-white w-6/12 px-12 dark:bg-gray-900">
      <div class="py-8 px-4  ">
      <h2 class="mb-4 text-3xl font-bold text-gray-900 text-center my-2 pb-4 dark:text-white">Register Yourself</h2>
      <form action="" onSubmit={handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="w-full">
                  <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                  <input onChange={handleChange}  type="text" name="firstName" value={credentials.firstName} id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your first name" required=""/>
              </div>

              <div class="w-full">
                  <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                  <input  onChange={handleChange} value={credentials.lastName} type="text" name="lastName" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your last name" required=""/>
              </div>
              
              <div class="sm:col-span-2">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input onChange={handleChange} type="email" value={credentials.email} name="email" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your Email" required=""/>
              </div>

              <div class="sm:col-span-2">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Roll No</label>
                  <input onChange={handleChange} type="text" value={credentials.rollNo} name="rollNo" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your Roll No" required=""/>
              </div>
              
              <div>
                  <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                  <select value={credentials.year} onChange={handleChange} name='year' id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected="">Select year</option>
                      <option value="TV">1st</option>
                      <option value="PC">2nd</option>
                      <option value="3">3rd</option>
                      <option value="PH">4th</option>
                  </select>
              </div>

              <div>
                  <label for="item-weight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Branch</label>
                  <select value={credentials.branch} name='branch' onChange={handleChange} id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected="">Select Branch</option>
                      <option value="TV">Computer Science Enginnering</option>
                      <option value="Computer Science and Design Engineering">CSD</option>
                      <option value="GA">IT</option>
                      <option value="PH">MNC</option>
                  </select>
              </div> 
        
              <div class="sm:col-span-2">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input onChange={handleChange} type="password" value={credentials.password} name="password" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type Password" required=""/>
              </div>

              <div class="sm:col-span-2">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <input onChange={handleChange} type="password" value={credentials.confirmPassword} name="confirmPassword" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type confirm Password" required=""/>
              </div>

              <div class="sm:col-span-2">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter OTP</label>
                  <input onChange={handleChange} type="text" value={credentials.otp} name="otp" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type Password" required=""/>
              </div>
             
          </div>
          <div className="text-center">
          <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Register
          </button>
          </div>
      </form>
  </div>
</div>
    </div>}
    </>
  )
}

export default RegisterStudent
