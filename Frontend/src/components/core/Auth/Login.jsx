import React from 'react'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { login } from "../../../services/operations/authAPI"

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [showPassword, setShowPassword] = useState(false)
    const { email, password } = credentials

    const handleOnChange = (e) => {
        setCredentials((credentials) => ({
            ...credentials,
            [e.target.name]: e.target.value,
        }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(login(email, password, navigate))
    }


    return (
        <div className="items-center py-4 h-screen flex justify-center">
            <div className="bg-white md:w-6/12 w-9/12 px-12 dark:bg-gray-900">
                <div className="py-8 px-4  ">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 text-center my-2 pb-4 dark:text-white">Login</h2>
                    <form action="" className='w-full ' onSubmit={handleSubmit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

                            <div className="sm:col-span-2">
                                <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input onChange={handleOnChange} type="email" value={credentials.email} name="email" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your email" required="" />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <div className="flex items-center justify-between">
                                <input onChange={handleOnChange} type={showPassword ? "text" : "password"} value={password} name="password" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter password" required="" />
                                <span
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className=" right-3 top-[38px] z-[10] cursor-pointer"
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                    ) : (
                                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                    )}
                                </span>
                                </div>
                                <Link to="/forgot-password">
                                    <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                                        Forgot Password
                                    </p>
                                </Link>
                            </div>


                        </div>
                        <button type="submit" className="mt-4 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
