import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
      useSendOtpMutation,
      useSignUpMutation,
      useLoginMutation,
} from '../../../services/authApi';
import {useGetBranchesByYearMutation} from '../../../services/branchApi'

const ACCOUNT_TYPE = { STUDENT: "Student", INSTRUCTOR: "Instructor" };

const passwordRules = {
  minLength: 6,
  regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/
};

const validatePassword = (password) => {
  if (password.length < passwordRules.minLength) {
    return "Password must be at least 6 characters long";
  }
  if (!passwordRules.regex.test(password)) {
    return "Password must contain uppercase, lowercase, number & special character";
  }
  return null;
};



const SignUpForm = ({isLogin}) => {
      // const router = useNavigate();
      const [isLogging, setIsLogging] = useState(isLogin);
      const [sendOtp, { isLoading }] = useSendOtpMutation();
      const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
      const [login, { isLoading: isLoggingIn }] = useLoginMutation();
      const [getBranches, { isLoading: isGettingBranches }] = useGetBranchesByYearMutation();

      const navigate = useNavigate();

      const [step, setStep] = useState('details');
      const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
      const [formData, setFormData] = useState({
            firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
            rollNo: "", year: "", branch: "",
      });
      const [otp, setOtp] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      const { firstName, lastName, email, rollNo, year, branch, password, confirmPassword } = formData;
      const handleOnChange = (e) => {
            // console.log(e.target.name, e.target.value)
            setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));}

      // --- HANDLER FOR THE DETAILS FORM ---
      const handleDetailsSubmit = async (e) => {
            e.preventDefault();
            const passwordError = validatePassword(password);
  if (passwordError) {
    toast.error(passwordError);
    return;
  }
            if (password !== confirmPassword) {
                  toast.error("Passwords do not match");
                  return;
            }
            try {
                  await sendOtp({ email, checkUserPresent: true }).unwrap();
                  toast.success('OTP Sent Successfully!');
                  setStep('otp');

            } catch (err) {
                  const errorMessage = err.data?.message || 'Could not send OTP.';
                  toast.error(errorMessage);
            }
      };

      // --- HANDLER FOR THE OTP FORM ---
      const handleOtpSubmit = async (e) => {
            e.preventDefault();
            const signupData = { ...formData, accountType, otp };

            try {
                  await signUp(signupData).unwrap();
                  toast.success("Signup Successful! Please log in.");
                  //REFRESH WINDOW after 3 seconds

                  setTimeout(() => {
                        window.location.reload();
                  }, 3000);
            } catch (err) {
                  const errorMessage = err.data?.message || 'Signup failed. Please try again.';
                  toast.error(errorMessage);
            }
      };


      const [loginEmail,setLoginEmail]=useState("");
      const [loginPassword,setLoginPassword]=useState("");

      const handleLoginSubmit = async(e) => {
            e.preventDefault();
            const loginData = { email: loginEmail, password: loginPassword };

            try {
                  const result = await login(loginData).unwrap();
                  toast.success("Login Successful!");
                  // console.log(result)

                  if (result.user?.accountType === "Student") {
            navigate(`/dashboard/s/${result.user?._id}`);
        } else if (result.user?.accountType === "Admin") {
            navigate(`/dashboard/a/${result.user?._id}`);
        } else if (result.user?.accountType === "Instructor") {
           navigate(`/dashboard/i/${result.user?._id}`);
        } else {
            // Fallback for any other roles or if accountType is missing
            navigate("/");
        }
            } catch (err) {
                  const errorMessage = err.data?.message || 'Login failed. Please try again.';
                  toast.error(errorMessage);
            }
      }

      const [branchList, setBranchList] = useState([]);

      useEffect(()=>{
            function fetchBranches() {
                  getBranches({ year }).unwrap()
                        .then((data) => {
                              // console.log("Branches for year", year, data);
                              setBranchList(data);
                        })
                        .catch((error) => {
                              console.error("Failed to fetch branches:", error);
                        });
            }

            if (year) {
                  fetchBranches();
            }
      },[year])


      // --- Reusable Tailwind classes for inputs and select dropdowns ---
      const formFieldStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";


      // --- JSX for the Details Form ---
      const renderDetailsForm = () => (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  {/* Role Selector */}
                  <div className="flex rounded-full bg-gray-200 p-1">
                        {[ACCOUNT_TYPE.STUDENT, ACCOUNT_TYPE.INSTRUCTOR].map((type) => (
                              <button type="button" key={type} onClick={() => setAccountType(type)} className={`w-full rounded-full p-2 text-sm font-semibold transition ${accountType === type ? "bg-white shadow-sm text-black" : "bg-transparent text-gray-600"}`}>
                                    {type}
                              </button>
                        ))}
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900">First Name <span className="text-red-500">*</span></label>
                              <input name="firstName" value={firstName} onChange={handleOnChange} className={formFieldStyle} required />
                        </div>
                        <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900">Last Name <span className="text-red-500">*</span></label>
                              <input name="lastName" value={lastName} onChange={handleOnChange} className={formFieldStyle} required />
                        </div>
                  </div>

                  {/* --- Conditional Student Fields --- */}
                  {accountType === ACCOUNT_TYPE.STUDENT && (
                        <div className="space-y-4">
                              <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Roll No <span className="text-red-500">*</span></label>
                                    <input name="rollNo" value={rollNo} onChange={handleOnChange} className={formFieldStyle} required />
                              </div>
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* --- YEAR DROPDOWN --- */}
                                    <div>
                                          <label className="block mb-2 text-sm font-medium text-gray-900">Year <span className="text-red-500">*</span></label>
                                          <select name="year" value={year} onChange={handleOnChange} className={formFieldStyle} required>
                                                <option value="" disabled>Select Year</option>
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                          </select>
                                    </div>
                                    {/* --- BRANCH DROPDOWN --- */}
                                    <div>
                                          <label className="block mb-2 text-sm font-medium text-gray-900">Branch <span className="text-red-500">*</span></label>
                                          <select name="branch" value={branch} onChange={handleOnChange} className={formFieldStyle} required>
                                                <option value="" disabled>Select Branch</option>
                                                {branchList.map((b) => (
                                                      <option key={b._id} value={b._id}>{b.name}</option>
                                                ))}
                                          </select>
                                    </div>
                              </div>
                        </div>
                  )}

                  {/* Email */}
                  <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Email Address <span className="text-red-500">*</span></label>
                        <input name="email" value={email} type="email" onChange={handleOnChange} className={formFieldStyle} required />
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="relative">
                              <label className="block mb-2 text-sm font-medium text-gray-900">Password <span className="text-red-500">*</span></label>
                              <input name="password" value={password} type={showPassword ? 'text' : 'password'} onChange={handleOnChange} className={formFieldStyle} required />
                              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] cursor-pointer">
                                    {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                              </span>
                        </div>
                        <div className="relative">
                              <label className="block mb-2 text-sm font-medium text-gray-900">Confirm Password <span className="text-red-500">*</span></label>
                              <input name="confirmPassword" value={confirmPassword} type={showConfirmPassword ? 'text' : 'password'} onChange={handleOnChange} className={formFieldStyle} required />
                              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-[38px] cursor-pointer">
                                    {showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                              </span>
                        </div>
                  </div>

                  <button type="submit" className="w-full rounded-lg bg-gray-800 p-3 font-semibold text-white hover:bg-gray-700">
                        {isLoading || isSigningUp ? 'Please wait...' : 'Send OTP'}
                  </button>

                  <p className="mt-4 text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <span type="button" onClick={() => setIsLogging(true)} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                              Log in
                        </span>
                  </p>
            </form>
      );

      // --- JSX for the OTP Form (No changes here) ---
      const renderOtpForm = () => (
            <form onSubmit={handleOtpSubmit} className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-black">Verify Your Email</h2>
                  <p className="text-gray-500">
                        An OTP has been sent to <strong className="text-gray-800">{email}</strong>
                  </p>
                  <div>
                        <label htmlFor="otp" className="sr-only">Enter OTP</label>
                        <input name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className={`${formFieldStyle} text-center text-2xl tracking-[.5em]`} maxLength="6" required />
                  </div>
                  <button type="submit" className="w-full rounded-lg bg-gray-800 p-3 font-semibold text-white hover:bg-gray-700">
                        Verify & Create Account
                  </button>
                  <button type="button" onClick={() => sendOtp(email)} className="text-sm bg-white text-blue-600 hover:underline">
                        Resend OTP
                  </button>
            </form>
      );

      const renderLoginForm = () => {
            return (
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-black">Welcome Back!</h2>
                        <p className="text-gray-500">Please enter your credentials to continue.</p>
                        <div>
                              <label htmlFor="email" className="sr-only">Email</label>
                              <input name="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="email" className={formFieldStyle} placeholder="Email" required />
                        </div>
                        <div>
                              <label htmlFor="password" className="sr-only">Password</label>
                              <input name="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={formFieldStyle} placeholder="Password" type="password" required />
                        </div>
                        <button type="submit" className="w-full rounded-lg bg-gray-800 p-3 font-semibold text-white hover:bg-gray-700">
                              Log In
                        </button>
                        <p className="mt-4 text-sm text-center text-gray-500">
                        Don't have an account?{" "}
                        <span type="button" onClick={() => setIsLogging(false)} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                              Sign Up
                        </span>
                  </p>
                  </form>
            );
      };

      return (
            <div className="  ">
                  <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
                        {isLogging ? 'Log In' : 'Create an Account'}
                  </h1>
                  <p className="text-center text-gray-500 mb-8">
                      {isLogging ? 'Welcome back! Please log in to your account.' : 'Join our community of learners and educators.'}
                  </p>

                  {isLogging ? renderLoginForm() : step === 'details' ? renderDetailsForm() : renderOtpForm()}
            </div>
      );
};

export default SignUpForm;
