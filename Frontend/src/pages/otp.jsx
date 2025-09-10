// import React from 'react'
// import axios from 'axios';
// import { useState } from 'react'
// import RegisterStudent from '../../Student/RegisterStudent';
// import TeacherRegister from '../../teacher/register';
// import RegisterAdmin from '../../admin/SignUp/register'

// const otp = () => {
//   const role = window.location.pathname.split('/')[2]
//     const [send, setSend] = useState(false)
//     const [email, setEmail] = useState('')
//     const [otp, setOtp] = useState('')
//     const [error, setError] = useState('')
//     const [success, setSuccess] = useState('')
 

//     const handleSend = async (e) => {
//         e.preventDefault()
//         console.log(email)  
//         const res = await axios.post('http://localhost:4000/api/v1/auth/sendOTP', { email })
//        if(res.status === 200){
//          alert(res.data.message)
//         setSend(true)
//         setSuccess(res.data.message)
//        }
//         else{
//           alert(res.data)
//           setError(res.data.message)
//         }
//       }

    

//   return (
//     <>
//     {
//       success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
//         <strong className="font-bold">Success!</strong>
//         <span className="block sm:inline">{success}</span>
//       </div>
//     }
//     {
//       error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//         <strong className="font-bold">Error!</strong>
//         <span className="block sm:inline">{error}</span>
//       </div>
//     }
//     <div>
//     {!send ? (
//       <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
//         <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
//           <div className="p-4 sm:p-7">
//             <div className="text-center">
//               <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
//                 Verify your email
//               </h1>
//             </div>

//             <div className="mt-5">
//               <form>
//                 <div className="grid gap-y-4">
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-bold ml-1 mb-2 dark:text-white"
//                     >
//                       Email address
//                     </label>
//                     <div className="relative">
//                       <input
//                         onChange={(e) => setEmail(e.target.value)}

//                         type="email"
//                         id="email"
//                         name="email"
//                         className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
//                         required
//                         aria-describedby="email-error"
//                       />
//                     </div>
//                     <p className="hidden text-xs text-red-600 mt-2" id="email-error">
//                       Please include a valid email address so we can get back to you
//                     </p>
//                   </div>
//                   <button onClick={handleSend}
//                     type="submit"
//                     className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
//                   >
//                     Send OTP
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </main>
//     ) : role==='Student'?<RegisterStudent/>:role==='Instructor'?<TeacherRegister/>:<RegisterAdmin/>}
//   </div>
//   </>
// );
// };

// export default otp;