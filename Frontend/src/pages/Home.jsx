import React from 'react'
import bg from '../assets/bg.png'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/common/Navbar'
import { BGPattern } from '../components/common/Pattern'

const Home = () => {
      const navigate = useNavigate();

  return (
    <div>
      {/* NAVBAR */}
      <Navbar/>
      <div className="relative text-black flex aspect-video flex-col items-center justify-center rounded-2xl border-2 text-center ">
				<BGPattern variant="dots" mask="fade-center" />
				<p className="font-bold text-5xl">Managing Attendance Made Easy</p>
            <p className="my-6 text-gray-600 w-[60%]">Say No to Manual Attendance with our latest technology. Empowering organizations to streamline attendance tracking effortlessly. No false proxies, paperwork or errors. Join us today and experience the future of attendance management.</p>
            <button className="text-white " onClick={()=>{navigate('/aboutUs')}}>Learn About Us</button>
			</div>

     
    
//     </div>
  )
}

// export default Home
