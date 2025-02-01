import React from 'react'
import bg from './assets/bg.png'
import { Link } from 'react-router-dom'

const Home = () => {

  const handleSignUp = () => {
    window.location.href = '/signup'
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }
  return (
    <div>
      <img className="-z-0 absolute top-0" width={875} src={bg} />
      <div className="z-10 absolute top-52 right-14 w-6/12 font-bold text-4xl">
        <div className="">Attendance Management System using FACE RECOGNITION and GEOLOCATIONS</div>

      </div>

      <div className="flex gap-5 items-center z-10 absolute top-96 right-1/3">
        <button onClick={handleSignUp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Sign Up</button>

        <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Login</button>
      </div>

    
    </div>
  )
}

export default Home
