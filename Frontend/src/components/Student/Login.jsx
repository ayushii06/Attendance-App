import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { login, loginError } from "../../slice/authSlice";


const Login = () => {
    const [credentials,setCredentials] = useState({
        email:'',
        password:'',
    })

    const dispatch = useDispatch()

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
            const res = await axios.post('http://localhost:4000/api/v1/auth/login',credentials,
            )
            console.log(res)

            if(res.status === 200){
                localStorage.setItem('token',res.data.token)
               
                if(res.data.user.accountType === 'Student'){
                    dispatch(
                    
                        login({
                           
                          user: {
                            firstName: res.data.user.firstName,
                            lastName: res.data.user.lastName,
                            rollNo: res.data.user.rollNo,
                            account_type: res.data.user.accountType,
                            branch: res.data.user.branch,
                            course: res.data.user.courses,
                          },
                          token: res.data.token,
                        })
                      );
                      navigate('/student_dashboard')
                }
                else if(res.data.user.accountType === 'Instructor'){
                    dispatch(
                        login({
                            user: {
                                id: res.data.user._id,
                                firstName: res.data.user.firstName,
                                lastName: res.data.user.lastName,
                                account_type: res.data.user.accountType,
                                course: res.data.user.courses,
                            },
                            token: res.data.token,
                        })
                    );  
                    navigate('/teacher_dashboard')
                }
                else if(res.data.user.accountType === 'Admin'){
                    dispatch(
                        login({
                            user: {
                                firstName: res.data.user.firstName,
                                lastName: res.data.user.lastName,
                                account_type: res.data.user.accountType,
                            },
                            token: res.data.token,
                        })

                    );
                   
                    navigate('/admin_dashboard')
                }
                else{
                    navigate('/login')
                }
                
            }
            else{
                dispatch(loginError("Invalid username or password"));
                alert(res.data.message)
            }
        } catch (error) {
            alert('Invalid username or password')
        }

    }

  return (
    <div className="items-center py-4 flex justify-center">
      <div class="bg-white w-6/12 px-12 dark:bg-gray-900">
      <div class="py-8 px-4  ">
      <h2 class="mb-4 text-3xl font-bold text-gray-900 text-center my-2 pb-4 dark:text-white">Login</h2>
      <form action="" onSubmit={handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        
              <div class="sm:col-span-2">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input onChange={handleChange} type="email" value={credentials.email} name="email" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your email" required=""/>
              </div> 

              <div class="sm:col-span-2">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input onChange={handleChange} type="password" value={credentials.password} name="password" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ener password" required=""/>
              </div>
             
          </div>
          <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Login
          </button>
      </form>
  </div>
</div>
    </div>
  )
}

export default Login
