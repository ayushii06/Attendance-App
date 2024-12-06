import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestData = () => {
  const course = window.location.pathname.split('/')[2];
  const navigate = useNavigate();

  const rollNo = useSelector((state) => state.auth.user.rollNo);

  const [faceVerified, setFaceVerified] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
          setError('Unable to fetch location: ' + err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const verifyFace = async () => {
    try {
      const res = await axios.post('http://localhost:1000/recognize');
      console.log('Face verification response:', res);

      if (res.status === 200) {
        console.log('Face Verified:', res.data.roll_no);
        console.log('Roll No:', rollNo);

        if (res.data.roll_no === rollNo) {
          setSuccess('Face Verified Successfully');
          setFaceVerified(true);
        } else {
          setFaceVerified(false);
          alert('Roll No does not match');
        }
      } else {
        setFaceVerified(false);
        console.error('Error in verification:', res.data.message);
      }
    } catch (error) {
      setFaceVerified(false);
      console.error('Error in API call:', error);
    }
  };


  const verifyAttendance = async (latitude, longitude) => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/v1/attendance/markAttendance',
        { course: course, latitude:latitude, longitude:longitude },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log(res);
      if (res.status === 200) {
        setError('User is outside the 100-meter radius. Attendance not marked.');
        setFaceVerified(false);
        alert('Attendance Marked Successfully');
        navigate('/student_dashboard');
      } else {
        console.log('Failed to mark attendance:', res.data.error);
        alert(res.data.error || 'Failed to mark attendance');
      }
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message || 'Failed to mark attendance');
}
  };

  const handleVerificationFlow = () => {
    if (faceVerified) {
      getLocation(); // Only call getLocation once face verification is done
    }
  };

  React.useEffect(() => {
    handleVerificationFlow();
  }, [faceVerified]); // Trigger location fetch when faceVerified is updated

  return (
    <>
      {success && (
        <div
          className="bg-green-100 border  w-1/2 fixed top-12 text-center left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-green-400 text-green-700 px-4 py-3 rounded "
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">{success}</span>
          
        </div>
      )}
      {error && (
        <div
          className="bg-red-100 border 
          w-1/2 fixed top-12 text-center left-1/2 transform -translate-x-1/2 -translate-y-1/2
           border-red-400 text-red-700 px-4 py-3 rounded "
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {faceVerified ? (
        <div className="text-center my-32 font-medium text-2xl ">
          <div className="">Please wait for some time 
          while we are verifying your location...</div>
         
        </div>
      ) : (
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
          <div className="
          text-sm font-medium text-black my-8

          ">
          Note : As soon as there appears a box around your face, press the Enter button to proceed.
          </div>
        </div>
      )}
    </>
  );
};

export default TestData;
