import React, { useState, useEffect } from 'react'
import { useStartAttendanceSessionMutation,useStopAttendanceSessionMutation } from '../../../services/attendanceApi'
import { useGetBranchesByYearMutation } from '../../../services/branchApi';
import { Check, X } from 'lucide-react';


function TakeAttendance({ user }) {
  const courses = user?.courses ? user.courses : [];
  console.log("Courses:", courses);

  const [getBranches, { isLoading: isGetting }] = useGetBranchesByYearMutation();
  const [createAttendanceSession, { isLoading: isCreating }] = useStartAttendanceSessionMutation();
  const [stopAttendanceSession, { isLoading: isStopping }] = useStopAttendanceSessionMutation();

  const [branches, setBranches] = useState([]);
  const [expiresAt, setExpiresAt] = useState(null);

  const findBranchByYear = async (year) => {
    if(!year) return;
    try {
      const result = await getBranches({ year }).unwrap();
      console.log("Branches fetched:", result);
      setBranches(result);

    } catch (error) {
      toast.error("Failed to fetch branches.");
    }
  }

  const [uiState, setUiState] = useState('initial');

  const [formState, setFormState] = useState({
    duration: '',
    course: '',
    year: '',
    branch: '',
    newLecture: '',
  });

  // State for location and its status
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  // State for a simple message box (replaces alert())
  const [message, setMessage] = useState(null);


  // Effect hook to handle geolocation based on UI state
  useEffect(() => {
    if (uiState === 'getting_location') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
            setUiState('form');
          },
          (error) => {
            setLocation({
              latitude: null,
              longitude: null,
              error: 'Geolocation access denied or unavailable. Please enable it in your browser settings.',
            });
            setUiState('initial');
            setMessage({ type: 'error', text: 'Location access is required to start a session.' });
          }
        );
      } else {
        setLocation({
          latitude: null,
          longitude: null,
          error: 'Geolocation is not supported by your browser.',
        });
        setUiState('initial');
        setMessage({ type: 'error', text: 'Your browser does not support geolocation.' });
      }
    }
  }, [uiState]);

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courses.find(c => c._id === selectedCourseId);
    const y = selectedCourse ? selectedCourse.year : '';

    setFormState(prevState => ({
      ...prevState,
      course: e.target.value,
      year: y,
    }));
  
    console.log(formState.course ? courses.find(c => c._id === e.target.value).year : '');
    findBranchByYear(formState.year);
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle the initial button click to start the session process
  const handleStartSession = () => {
    setMessage(null);
    setUiState('getting_location');
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    const sessionData = {
      ...formState,
      latitude: location.latitude,
      longitude: location.longitude,
      duration: parseInt(formState.duration),
      lectureNo: parseInt(formState.lectureNo),
    };
    console.log("Submitting session data:", sessionData);
    try {
      const response = await createAttendanceSession(sessionData).unwrap();
      console.log('Attendance session created:', response);
      const expiration = new Date(response.session.expiresAt);
      setExpiresAt(expiration.toLocaleTimeString());
      // setSessionId(response.id);
      setMessage({ type: 'success', text: 'Attendance session started successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create attendance session. Please try again.' });
      return; 
    }
    setMessage({ type: 'success', text: 'Attendance session started successfully!' });
    setUiState('started'); // Reset UI after successful submission
  };

  const handleStopSession = async() => {
    try {
      const response = await stopAttendanceSession(formState.course).unwrap();
      console.log('Attendance session stopped:', response);
      setUiState('initial');
      setFormState({
      duration: '',
      course: '',
      year: '',
      branch: '',
      newLecture: '',
    });
    setLocation({
      latitude: null,
      longitude: null,
      error: null,
    });
    setMessage(null);
    setExpiresAt(null);

      setMessage({ type: 'success', text: 'Attendance session stopped successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to stop attendance session. Please try again.' });
    }
  
  };

  // Render a custom message box
  const renderMessage = () => {
    if (!message) return null;
    return (
      <>
      <div className={`p-4 flex items-center justify-center gap-3 rounded-lg font-semibold text-center text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {message.type === 'error' && <><X className='text-red-500 bg-white rounded-full font-bold px-2 py-2 h-8 w-8' /></>
        }
        {message.type === 'success' && <><Check className='text-green-500 bg-white rounded-full font-bold px-2 py-2 h-8 w-8' /></>}
        {message.text}
      </div>
      </>
    );
  };

  const formFieldStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5";



  const renderContent = () => {
    switch (uiState) {
      case 'initial':
        return (
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Teacher Attendance Portal
            </h1>
            <p className="text-sm text-gray-600 text-center">Click the button below to begin an attendance session.</p>
            <button
              onClick={handleStartSession}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Attendance Session
            </button>
          </div>
        );

      case 'getting_location':
        return (
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Getting Location...
            </h1>
            <p className="text-gray-600">Please allow location access to continue.</p>
            {/* A simple spinner or loading icon */}
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );

      case 'form':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Start Attendance Session
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location status display */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                  {!location.error && (
                    <p className="text-sm text-green-600">Location found!</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">Your current GPS coordinates will be used to create the session.</p>

              {/* Form inputs as dropdowns */}
              <div>
                <label htmlFor="course" className="mb-2 block text-sm font-medium text-gray-700">Course Name</label>
                <select
                  name="course"
                  id="course"
                  value={formState.course}
                  onChange={handleCourseChange}
                  required
                  className={formFieldStyle}
                >
                  <option value="" disabled>Select a course</option>
                  {courses.length === 0 ? <option value="" disabled>No courses assigned</option> :
                    courses.map(course => (
                      <option key={course._id} value={course._id}>{course.courseName}</option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="year" className="mb-2 block text-sm font-medium text-gray-700">Year</label>
                  <select name="year" value={formState.year} disabled={formState.course} className={formFieldStyle} required>
                    <option value="" disabled>Select a year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="branch" className="mb-2 block text-sm font-medium text-gray-700">Branch</label>
                  <select
                    name="branch"
                    id="branch"
                    value={formState.branch}
                    onChange={handleChange}
                    required
                    className={formFieldStyle}
                  >
                    <option value="" disabled>Select a branch</option>
                    {branches.length === 0 ? <option value="" disabled>No branches found</option> : branches.map(branch => (
                      <option key={branch._id} value={branch._id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="newLecture" className="mb-2 block text-sm font-medium text-gray-700">Is this a new lecture or Restarting previous Lecture?</label>
                <select
                  name="newLecture"
                  id="newLecture"
                  value={formState.newLecture}
                  onChange={handleChange}
                  required
                  className={formFieldStyle}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="true">New Lecture</option>
                  <option value="false">Restart Previous Lecture</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="mb-2block text-sm font-medium text-gray-700">Duration (in minutes)</label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  value={formState.duration}
                  onChange={handleChange}
                  required
                  className={formFieldStyle}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Session
              </button>
            </form>
          </>
        );

      case 'started':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Session expires at {expiresAt}
            </h1>

            <p className="text-gray-600 text-center">Your attendance session has been successfully started.</p>

            <button
              onClick={() => handleStopSession()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Stop Session
            </button>
          </>
        )
      default:
        return null;
    }
  };
  return (
    <>
      <div>
        <h1 className='text-3xl font-bold text-black'>Take Attendance</h1>
        <p className='text-gray-500 my-2'>Please select a course to take attendance.</p>
      </div>

      <div className=" mt-12 bg-gray-100 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg space-y-6">
          {renderMessage()}
          {renderContent()}
        </div>
      </div>

    </>
  )
}

export default TakeAttendance