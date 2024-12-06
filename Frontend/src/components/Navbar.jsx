import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <>
    <Link class="flex items-end justify-end px-5 py-4 hover:text-gray-200" to="/login">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 hover:text-gray-200" fill="white" viewBox="0 0 24 24" stroke="black">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
          </Link>
          


    </>
  )
}

export default Navbar
