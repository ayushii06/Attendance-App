import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BranchDetails = () => {
  const branchId = window.location.pathname.split('/')[2]; // Extract branch ID from URL
  const [branchDetails, setBranchDetails] = useState(null); // Use null to handle initial loading state
  const [error, setError] = useState(null); // Track errors

  const getBranchDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:4000/api/v1/branch/showBranchDetails',
        { branchId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setBranchDetails(res.data.branch);
      } else {
        setError('Failed to fetch branch details');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
    }
  };

  useEffect(() => {
    getBranchDetails();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!branchDetails) {
    return <div className="text-center text-gray-500">Loading branch details...</div>;
  }

  return (
    <div className="mx-12 text-center">
     
     <div className="flex justify-center gap-20 items-center">
        <div className="text-2xl text-white font-bold my-6 mb-12">{branchDetails.branchName}</div>
        <div className="text-2xl my-4 bg-white text-black font-medium rounded px-4 py-2">Academic Year - {branchDetails.year}</div>
        </div>

        <div className=" font-bold pb-12 text-2xl underline uppercase ">STUDENTS LIST</div>
     
      <div className="flex justify-center gap-6 flex-wrap ">
        {branchDetails.students && branchDetails.students.length > 0 ? (
          branchDetails.students.map((student, index) => (
            <div
              key={index}
              className="max-w-sm w-44 px-6 py-4 bg-white border border-gray-200 rounded shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="text-xl py-2 font-bold text-white ">
                {student.firstName} {student.lastName}
              </div>
              <div className="text-lg font-light  text-gray-600 dark:text-gray-400">
                {student.rollNo}
              </div>
              <div className="text-lg font-light  text-gray-600 dark:text-gray-400">
                {student.email}
              </div>
            </div>
          ))
        ) : (
          <div className="text-4xl font-black text-center mx-auto">No students found</div>
        )}
      </div>
    </div>
  );
};

export default BranchDetails;
