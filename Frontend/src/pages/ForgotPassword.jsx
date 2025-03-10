import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6"
import { getPasswordResetToken } from '../services/operations/authAPI';
import Spinner from '../components/common/Spinner';

const ForgotPassword = () => {
    const [emailsent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch()

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email ,setEmailSent));
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            {loading ? (
                <div  className=' flex items-center justify-center h-[90vh] '><Spinner/></div>
            ) : (
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-2xl mb-4">
                        {!emailsent ? "Reset Password" : "Check Your Email"}
                    </h1>
                    <p className="mb-6">
                        {!emailsent
                            ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery."
                            : `We have sent the reset email to ${email}`}
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {!emailsent && (
                            <label htmlFor="email" className="block mb-4">
                                <span className="block text-sm font-medium mb-2">Email Address:</span>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter Your Email Address'
                                    className="w-full px-3 py-2 bg-richblack-700 text-white  rounded focus:outline-none focus:ring-2 focus: ring-richblack-200"
                                />
                            </label>
                        )}
                        <button
                            type="submit"
                            className="w-full py-2 bg-yellow-100 text-black rounded hover:bg-yellow-200 transition-colors duration-200"
                            
                        >
                            {!emailsent ? "Reset Password" : "Resend Email"}
                        </button>
                    </form>
                    <div className="mt-6 ">
                        <Link to='/login' className="text-white flex flex-row items-center gap-2  ">
                          <FaArrowLeft />
                            <p>Back to Login</p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ForgotPassword;
