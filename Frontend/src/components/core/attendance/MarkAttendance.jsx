// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const TestData = () => {
//   const course = window.location.pathname.split('/')[2];
//   const navigate = useNavigate();


//   const verifyFace = () => {
//     navigate(`/verify_face/${course}`);
//   }


//   return (
//     <>
    
//         <div className="text-center my-36">
//           <div className="text-3xl font-bold">We will be verifying your face first!</div>
//           <div className="text-lg font-bold my-8">Please click on the button below and
//              look into the camera...</div>
         
//           <button
//             className="bg-blue-500 font-semibold text-white px-4 py-2 rounded-md mt-4"
//             onClick={verifyFace}
//           >
//             Verify Face
//           </button>
         
//         </div>
      
//     </>
//   );
// };

// export default TestData;


import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function MarkAttendance() {
      const [course, setCourse] = useState('');

      const user = useSelector((state) => state.auth.profile);
      const courses = user ? user.courses : [];

      console.log(courses);

            const formFieldStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5";


  return (
      <>
    <div className="flex justify-between items-center mb-8">
                    
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Mark Attendance</h1>
    
                </div>
                    <div className="w-[40%] mx-auto bg-white rounded-sm shadow-md p-6 ">
                        <div className="text-2xl mb-2 text-center  font-bold text-gray-800">Ready to mark attendance</div>
                        <div className='text-center text-sm text-gray-600 mb-6'>Select a course to check for an active session.</div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Course <span className="text-red-500">*</span></label>
                    <select name="course" value={course} onChange={(e) => setCourse(e.target.value)} className={formFieldStyle} required>
                        <option value="" disabled>Select Course</option>
                        {courses.map((course) => (
                              <option key={course._id} value={course._id}>{course.courseName}</option>
                        ))}

                    </select>

                    <div className="mx-auto mt-6">
                    <button onClick={()=>{}} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                        Check Session Status
                    </button>
                </div>
                    </div>
  </>
  )
}

export default MarkAttendance