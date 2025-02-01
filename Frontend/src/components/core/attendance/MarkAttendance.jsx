import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestData = () => {
  const course = window.location.pathname.split('/')[2];
  const navigate = useNavigate();


  const verifyFace = () => {
    navigate(`/verify_face/${course}`);
  }


  return (
    <>
    
        <div className="text-center my-36">
          <div className="text-3xl font-bold">We will be verifying your face first!</div>
          <div className="text-lg font-bold my-8">Please click on the button below and
             look into the camera...</div>
         
          <button
            className="bg-blue-500 font-semibold text-white px-4 py-2 rounded-md mt-4"
            onClick={verifyFace}
          >
            Verify Face
          </button>
         
        </div>
      
    </>
  );
};

export default TestData;
