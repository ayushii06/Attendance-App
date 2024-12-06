import React from 'react'
import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'

const Dashboard = () => {

  const firstName = useSelector((state) => state.auth.user?.firstName || "")
  const lastName = useSelector((state) => state.auth.user?.lastName || "")


  return (
    <>
    <div className="flex justify-between mx-12">
        <p className="font-medium text-white text-3xl">Welcome <b> {firstName} {lastName} !</b></p>
        
        
    </div>

    <div className='flex mx-60 my-12 flex-wrap justify-center items-center gap-8'>
      <div className="bg-white py-2 px-16 text-center flex flex-col gap-1 rounded-lg border-1 border-gray-50">
        <p className="font-bold text-4xl text-black">150</p>
        <p className="font-semibold text-lg text-black">Total Branches</p>
        <Link to='/branch' className='underline text-sm py-2'>View Branches</Link>
      </div>
      <div className="bg-white py-2 px-16 text-center flex flex-col gap-1 rounded-lg border-1 border-gray-50">
        <p className="font-bold text-4xl text-black">200</p>
        <p className="font-semibold text-lg text-black">Total Courses</p>
        <Link to='/show_courses' className='underline text-sm py-2'>View Courses</Link>
      </div>
      <div className="bg-white py-2 px-16 text-center flex flex-col gap-1 rounded-lg border-1 border-gray-50">
        <p className="font-bold text-4xl text-black">200</p>
        <p className="font-semibold text-lg text-black">Total Teachers</p>
        <Link to='/branches' className='underline text-sm py-2'>View Courses</Link>
      </div>
      <div className="bg-white py-2 px-16 text-center flex flex-col gap-1 rounded-lg border-1 border-gray-50">
        <p className="font-bold text-4xl text-black">200</p>
        <p className="font-semibold text-lg text-black">Total Students</p>
        <Link to='/branches' className='underline text-sm py-2'>View Courses</Link>
      </div>
      <div className="bg-white py-2 px-16 text-center flex flex-col gap-1 rounded-lg border-1 border-gray-50">
        <p className="font-bold text-4xl text-black">200</p>
        <p className="font-semibold text-lg text-black">Total Courses</p>
        <Link to='/branches' className='underline text-sm py-2'>View Courses</Link>
      </div>
    </div>
    </>
  )
}

export default Dashboard
