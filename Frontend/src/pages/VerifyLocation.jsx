import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { markAttendance } from '../services/operations/attendanceAPI'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';


function VerifyLocation() {
    const course = window.location.pathname.split('/')[2];
    const encrypted_id = window.location.pathname.split('/')[3];
    const token = useSelector((state) => state.auth.token);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              console.log('Location fetched:', position.coords);
              verifyAttendance(position.coords.latitude, position.coords.longitude);
            },
            (err) => {
                setLoading(false);
                toast.error('Unable to fetch location: ' + err.message);
            
            }
          );
        } else {
          setError('Geolocation is not supported by your browser.');
        }
      };

      useEffect(()=>{
        getLocation();
      },[1])

      const verifyAttendance = async (latitude, longitude) => {
          const res = await markAttendance(course, latitude, longitude,token,navigate);
            setLoading(false);
            console.log("RES",res);
            if(res===true){
                setAttendanceMarked(true);
                setTimeout(() => {
                    navigate('/student_dashboard');
                }, 5000);
            }
          
    };

  return (
    <>
        {attendanceMarked && (<>
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
        </>)}
        {loading && (<>
            <div className="text-center mt-32 mb-5 font-medium text-2xl ">
          <div className="">Please wait for some time 
          while we are verifying your location...</div>
         
        </div>
            <DotLottieReact className="w-80 mx-auto font-bold"      src="https://lottie.host/a6f11da2-3dfc-441d-aa6e-3db9130c8611/zqTLfDoCuf.lottie"
      loop
      autoplay
    />



        </>)}
    </>
  )
}

export default VerifyLocation