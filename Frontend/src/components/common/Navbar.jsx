import React from 'react'
import logo from '../../../public/logo.png'
import { useNavigate } from 'react-router-dom'

function Navbar() {
      const navigate = useNavigate();
  return (
    <div className='border-2 fixed top-4 left-32 right-32 rounded-3xl shadow-md my-4 text-black flex justify-between items-center p-4 z-10 bg-white'>
      <div className="">
            <img src={logo} alt="Logo" className="h-10 w-10"/>
      </div>

      <div className="flex gap-4 text-sm font-medium list-none">
            <li className='cursor-pointer hover:bg-gray-300 py-2 px-4 rounded-md' onClick={()=>{navigate('/')}}>Home</li>
            <li className='cursor-pointer hover:bg-gray-300 py-2 px-4 rounded-md' onClick={()=>{navigate('/aboutUs')}}>About Us</li>
            <li className='cursor-pointer hover:bg-gray-300 py-2 px-4 rounded-md' onClick={()=>{navigate('/contactUs')}}>Contact Us</li>
      </div>

      <button className='text-white' onClick={()=>{navigate('/signup')}}>Get Started</button>
    </div>
  )
}

export default Navbar