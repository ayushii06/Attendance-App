import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { markAttendance } from '../services/operations/attendanceAPI'
import { useSelector } from 'react-redux';
import getCoords from '../utils/getLocation';

function VerifyLocation({ course, setStep }) {
  const token = useSelector((state) => state.auth.token);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  async function getLocation() {
    try {
      const location = await getCoords();
      if (location) {
        verifyAttendance(location.latitude, location.longitude);
      }
      console.log(location); // { latitude: xx.xxxxx, longitude: xx.xxxxx }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getLocation();
  }, [1])

  const verifyAttendance = async (latitude, longitude) => {
    const res = await markAttendance(course, latitude, longitude, token, setErrorMessage);
    setLoading(false);
    console.log("RES", res);
    if (res === true) {
      setStep(4);
      setAttendanceMarked(true);
      setErrorMessage(null);
    }
    setTimeout(() => {
      window.location.reload();
      navigate('/student_dashboard');
    }, 4000);

  };

  return (
    <>
      {errorMessage && (
        <>
          <div className="bg-black mx-auto my-20 text-white px-10 py-10">
            <DotLottieReact className='w-80 my-10 mx-auto font-bold'
              src="https://lottie.host/cdcd5c2a-b2d8-4b15-8505-beb78e717d6b/jrIik8tJpI.lottie"
              loop
              autoplay
            />
            <div className="text-center mt-5 mb-5 font-medium text-2xl ">
              <div className="">ERROR : Attendance Not Marked!</div>
              <div className="text-2xl font-bold my-8">{errorMessage}</div>
            </div></div>
        </>
      )}
      {attendanceMarked && (<>
        <div className="bg-black mx-auto my-20 text-white px-10 py-10">
          <DotLottieReact className='w-80 mx-auto font-bold'
            src="https://lottie.host/92c241f0-e3bd-4244-99c9-6c899e7d7e3d/er9dkaK8tt.lottie"
            loop
            autoplay
          />
          <div className="text-center my-5 font-medium text-2xl ">
            <div className="">Attendance Marked Successfully!</div>

          </div>
          <div className="text-center my-2 font-medium text-2xl ">
            <div className="">You will be redirected to your dashboard. Do not press back button.</div>

          </div>
        </div>
      </>)}
      {loading && (<>
        <div className="bg-black mx-auto my-20 text-white px-10 py-10">
          <DotLottieReact
            src="https://lottie.host/a75a8e88-4671-4f6c-be2c-d814534be665/0v6THaooo5.lottie"
            loop
            autoplay
            className='w-80 mx-auto font-bold'
          />
          <div className="text-center mt-12 mb-5 font-medium text-2xl ">
            <div className="">Please wait for some time
              while we are fetching and verifying your location...</div>

          </div>
        </div>




      </>)}
    </>
  )
}

export default VerifyLocation