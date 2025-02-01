import React, { useState } from "react" 
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Tab from "../../../components/common/Tab"
import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slice/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"


const SignUp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    // student or instructor
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)
  
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      rollNo: "",
      year: "",
      branch: "",
      password: "",
      confirmPassword: "",
    })
  
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
    const { firstName, lastName, email, rollNo, year, branch, password, confirmPassword } = formData
  
    // Handle input fields, when some value changes
    const handleOnChange = (e) => {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }))
    }
  
    // Handle Form Submission
    const handleOnSubmit = (e) => {
      e.preventDefault()
  
      if (password !== confirmPassword) {
        toast.error("Passwords Do Not Match")
        return
      }
      const signupData = {
        ...formData,
        accountType,
      }
  
      // Setting signup data to state
      // To be used after otp verification
      dispatch(setSignupData(signupData))
      // Send OTP to user for verification
      dispatch(sendOtp(formData.email, navigate))
  
      // Reset
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        rollNo:"",
        year:"",
        branch:"",
        password: "",
        confirmPassword: "",
      })
      setAccountType(ACCOUNT_TYPE.STUDENT)
    }
  
    // data to pass to Tab component
    const tabData = [
      {
        id: 1,
        tabName: "Student",
        type: ACCOUNT_TYPE.STUDENT,
      },
      {
        id: 2,
        tabName: "Instructor",
        type: ACCOUNT_TYPE.INSTRUCTOR,
      },
    ]
  
    return (
        <>
              <Tab tabData={tabData} field={accountType} setField={setAccountType} />

        <div className="items-center py-4 flex justify-center">
      <div className="bg-white w-6/12 px-12 dark:bg-gray-900">
      <div className="py-8 px-4  ">
      <h2 className="mb-4 text-3xl font-bold text-gray-900 text-center my-2 pb-4 dark:text-white">Register Yourself</h2>
      <form action="" onSubmit={handleOnSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="w-full">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                  <input value={firstName}
                onChange={handleOnChange} type="text" name="firstName" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your first name" required=""/>
              </div>

              <div className="w-full">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                  <input  onChange={handleOnChange} value={lastName} type="text" name="lastName" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your last name" required=""/>
              </div>
              
              <div className="sm:col-span-2">
                  <label for="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input onChange={handleOnChange} type="email" value={email} name="email" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your Email" required=""/>
              </div>

              <div className="sm:col-span-2">
                  <label for="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Roll No</label>
                  <input onChange={handleOnChange} type="text" value={rollNo} name="rollNo" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your Roll No" required=""/>
              </div>
              
              <div>
                  <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                  <select value={year} onChange={handleOnChange} name='year' id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected="">Select year</option>
                      <option value="TV">1st</option>
                      <option value="PC">2nd</option>
                      <option value="3">3rd</option>
                      <option value="PH">4th</option>
                  </select>
              </div>

              <div>
                  <label for="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Branch</label>
                  <select value={branch} name='branch' onChange={handleOnChange} id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected="">Select Branch</option>
                      <option value="TV">Computer Science Enginnering</option>
                      <option value="Computer Science and Design Engineering">CSD</option>
                      <option value="GA">IT</option>
                      <option value="PH">MNC</option>
                  </select>
              </div> 
        
              <div className="sm:col-span-2">
                  <label for="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <div className="flex items-center justify-between">
                  <input type={showPassword ? "text" : "password"} onChange={handleOnChange} value={password} name="password" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type Password" required=""/>
                  <span
                onClick={() => setShowPassword((prev) => !prev)}
                className=" z-[10] cursor-pointer"
                >
                {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                  <label for="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <div className="flex items-center justify-between">

                  <input onChange={handleOnChange} type={showConfirmPassword ? "text" : "password"} value={confirmPassword} name="confirmPassword" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type confirm Password" required=""/>
                   <span onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="z-[10] cursor-pointer"
                >
                {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
                    </span>
                    </div>

              </div>
             
          </div>
          <div className="text-center">
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Register
          </button>
          </div>
      </form>
  </div>
</div>
    </div>
    
                </>
    )
}

export default SignUp