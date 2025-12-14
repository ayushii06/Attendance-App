// import { useDispatch, useSelector } from "react-redux";
// import { RxCross2 } from "react-icons/rx";
// import { isFaceRegistered } from "../../../../services/operations/faceRecognitionAPI";
// import { useEffect, useState } from "react";
// import RegisterFace from "../../../../pages/RegisterFace";
// import { ACCOUNT_TYPE } from "../../../../utils/constants";

// export default function EditProfile({ branch, courses, setModal, accountType }) {
//   const { user } = useSelector((state) => state.profile);
//   const [face, setFace] = useState(false);
//   const [register, setRegister] = useState(false);

//   useEffect(() => {
//     isFaceRegistered(user?.rollNo).then((res) => {
//       setFace(res);
//     });
//   }
//     , []);

//   const handleFaceRegister = () => {
//     setRegister(true);
//   }


//   return (
//     register ? (<RegisterFace />) : (

//       <div className="my-4 h-[95%] overflow-y-scroll flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-4 md:p-8 md:px-12 w-8/12 mx-auto">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-richblack-5">
//             Profile Information
//           </h2>
//           <RxCross2 className="cursor-pointer " onClick={() => { setModal(false) }} />
//         </div>
//         <div className="flex flex-col gap-5 ">


//           <label htmlFor="name" className="text-richblack-200">
//             Name
//           </label>
//           <div
//             className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"
//           >
//             {user?.firstName + " " + user?.lastName}
//           </div>
//         </div>



//         <div className="flex flex-col gap-5 ">


//           <label htmlFor="email" className="text-richblack-200">
//             Email
//           </label>
//           <div
//             className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"

//           >
//             {user?.email}
//           </div>

//         </div>

//         {accountType === ACCOUNT_TYPE.STUDENT &&
//           <>
//             <div className="flex flex-col gap-5 lg:flex-row">
//               <div className="flex flex-col gap-2 lg:w-[48%]">
//                 <label htmlFor="rollNo" className="text-richblack-200">
//                   Roll Number
//                 </label>
//                 <div

//                   className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"

//                 >
//                   {user?.rollNo}
//                 </div>

//               </div>
//               <div className="flex flex-col gap-2 lg:w-[48%]">
//                 <label htmlFor="branch" className="text-richblack-200">
//                   Branch
//                 </label>
//                 <div

//                   className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"

//                 >
//                   {branch}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-5 lg:flex-row">
//               <div className="flex flex-col gap-2 lg:w-[48%]">
//                 <label htmlFor="semester" className="text-richblack-200">
//                   Semester
//                 </label>
//                 <div

//                   className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"
//                 >
//                   {user?.semester + "th"}
//                 </div>

//               </div>
//               <div className="flex flex-col gap-2 lg:w-[48%]">
//                 <label htmlFor="year" className="text-richblack-200">
//                   Year
//                 </label>
//                 <div

//                   className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"
//                 >
//                   {user?.year}

//                 </div>

//               </div>
//             </div>



//             <div className="flex flex-col gap-5 ">


//               <label htmlFor="name" className="text-richblack-200">
//                 Courses Enrolled
//               </label>
//               <div
//                 type="text"
//                 readOnly
//                 name="name"
//                 id="name"
//                 placeholder="Enter your name"
//                 className="flex-wrap flex gap-2 justify-start items-center bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"

//               >
//                 {courses.map((course) => (
//                   <div key={course._id}>{course.courseName},</div>
//                 ))}
//               </div>
//             </div>

//             {face === false ? (<>
//               <div className="flex gap-2 flex-wrap items-center justify-center my-4">
//                 You have not registered your face yet. Please <div onClick={handleFaceRegister} className="underline text-blue-400 cursor-pointer">register</div> your face to mark attendance.
//               </div>
//             </>) : (<>
//               <div className="flex gap-2 flex-wrap items-center justify-center my-4">
//                 Your face is registered. Please submit a <div className="underline text-blue-400 cursor-pi">request</div> if you want to update your face.
//               </div>
//             </>)}

//             <div className="flex gap-2 items-center justify-center my-4">Want to update Information? Submit a <div className="underline text-blue-400 cursor-pi"> Request</div></div>
//           </>
//         }

//         {accountType === ACCOUNT_TYPE.INSTRUCTOR && (<>
//           <div className="flex flex-col gap-5 lg:flex-row">
//             <div className="flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="designation" className="text-richblack-200">
//                 Designation
//               </label>
//               <div

//                 className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"

//               >
//                 {user?.designation || "Not Specified"}
//               </div>

//             </div>
//             <div className="flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="department" className="text-richblack-200">
//                 Department
//               </label>
//               <div

//                 className="form-style bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"

//               >
//                 {user?.department || "Not Specified"}
//               </div>
//             </div>
//           </div>
      
//           <div className="flex flex-col gap-5 ">
//             <label htmlFor="name" className="text-richblack-200">
//               Teaching Courses
//             </label>
//             <div
//               type="text"
//               readOnly
//               name="name"
//               id="name"
//               placeholder="Enter your name"
//               className="flex-wrap flex gap-2 justify-start items-center bg-richblack-700 text-white p-2 rounded-md shadow-sm shadow-white"

//             >
//               {courses.length === 0 &&<div>Not Specified</div>}
              
//               {courses.map((course) => (
//                 <div key={course._id}>{course.courseName },</div>
//               ))}
//             </div>
//             </div>
//         </>)}
//       </div>



//     )
//   );
// }
