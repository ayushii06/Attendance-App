// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { getAllBranches } from '../../../services/operations/branchAPI';
// import { useSelector } from 'react-redux';
// import CreateBranch from './CreateBranch';

// const Branch = () => {
//   const initialState = [];
//  const [branches, setBranches] = useState(initialState);
//   const [year, setYear] = useState('1');
//   const navigate = useNavigate();

//   const [option,setOption] = useState('')

//   const branchDetails = (branch_id) => {
//     navigate(`/branch/${branch_id}`);
//   };

//   const handleCreate = () => {
//     setOption('create_branch')
//     // navigate('/create_branch');
//   };

//   const desc = '';

//   const token = useSelector((state) => state.auth.token);
//   console.log('Token', token);

//   const getBranches = async () => {
//     const res = await getAllBranches(year, token);
//     setBranches(res);
//   }
  
//   // const getBranches = async () => {
    
//   //   try {
//   //     const url = `http://localhost:4000/api/v1/branch/showAllBranch`;

//   //     const res = await axios.post(url,
//   //       { year: year },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
         
        
       
//   //   );
//   //     if (res.status === 200) {
//   //       console.log('Branches: ', res.data);
//   //       setBranches(res.data.allBranch);
        
//   //     } else {
//   //       console.log('Error fetching branches');
//   //     }
//   //   } catch (error) {
//   //     console.log('Error: ', error);
//   //   }
//   // };

  

//   useEffect(() => {
//     if (year) {
//       getBranches();
//     }
//   }, [year]);

//   const handleModalToggle = () => {
//     setOption('')
//   }

//   return (
//     <>
   
//       <div className="flex justify-between items-center mx-14">
//         <div className="font-bold text-lg">Showing {branches.length} results</div>
//         <button
//           type="button"
//           className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
//           onClick={handleCreate}
//         >
//           Create New Branch
//         </button>
//       </div>

//       <div className="mx-12 my-5">
//         <select
//           id="category"
//           onChange={(e) => setYear(e.target.value)}
//           value={year}
//           className="border-white border-2 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-44 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//         >
//           <option value="">Select Year</option>
//           <option value="1">1st Year</option>
//           <option value="2">2nd Year</option>
//           <option value="3">3rd Year</option>
//           <option value="4">4th Year</option>
//         </select>
//       </div>

//       {branches.length === 0 && (
//         <div className="flex justify-center items-center h-96">
//           <h1 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">No Branches Found</h1>
//         </div>
//       )
//         }

//       <div className="flex flex-wrap justify-center gap-24 mx-12 my-12">
//         {branches.map((branch) => (
//           <div key={branch._id} className="w-3/12 px-5 py-6 bg-white border text-center border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//             <div className="flex items-center justify-center text-center font-bold mb-4">
//               <span className="text-lg text-gray-600 dark:text-gray-400">Total Students : {branch.student.length}
//                   </span>
//             </div>
//             <h5 className="mb-6 text-xl text-center font-semibold  text-gray-900 dark:text-white">
//               {branch.name}
//             </h5>
//             <p className="mb-3 text-center font-normal text-gray-500 dark:text-gray-400">{
//               branch.description.slice(0, 100)
//               }...</p>
//             <button
//               onClick={() => branchDetails(branch._id)}
//               className="inline-flex text-center bg-transparent  font-medium items-center text-blue-600 "
//             >
//               Get more Info
//               <svg className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
//                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778" />
//               </svg>
//             </button>
//           </div>
//         ))}
//       </div>
      

//     {option==='create_branch' && (
//       <div className="fixed top-0 left-0 bg-black bg-opacity-50 z-10 p-4 w-full h-full">
    
//       <CreateBranch handleModalToggle={handleModalToggle}/>
      
  
//   </div>
//     )}
//     </>
//   );
// };

// export default Branch;
