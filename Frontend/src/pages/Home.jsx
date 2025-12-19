import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { BGPattern } from "../components/common/Pattern";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* NAVBAR */}
      <Navbar />
        <BGPattern variant="dots" mask="fade-center" />


      <div className="pt-28 md:pt-32">

      <div className="
        relative 
        text-black 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-2xl 
        text-center
        px-4
        py-16
        sm:px-6
        md:px-12
        lg:px-20
        min-h-[70vh]
      ">

        {/* Badge */}
        <div className="
          inline-flex 
          items-center 
          gap-2 
          px-3 
          py-1 
          mb-4 
          bg-indigo-50 
          text-indigo-700 
          rounded-full 
          text-xs 
          font-bold 
          tracking-wide 
          uppercase 
          border 
          border-indigo-100
        ">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
          Next-Gen Attendance Solution
        </div>

        {/* Heading */}
        <p className="
          font-bold 
          text-3xl
          sm:text-4xl
          md:text-5xl
          lg:text-6xl
          leading-tight
        ">
          Managing Attendance Made Easy
        </p>

        {/* Description */}
        <p className="
          my-6 
          text-gray-600 
          text-sm
          sm:text-base
          md:text-lg
          w-full
          sm:w-4/5
          md:w-3/5
        ">
          Say No to Manual Attendance with our latest technology. Empowering
          organizations to streamline attendance tracking effortlessly. No false
          proxies, paperwork or errors. Join us today and experience the future
          of attendance management.
        </p>

        {/* CTA Button */}
        <button
          className="
            px-8
            sm:px-10
            md:px-12
            py-3
            rounded-lg
            bg-gray-800
            font-semibold
            text-white
            hover:bg-gray-700
            transition
          "
          onClick={() => navigate("/aboutUs")}
        >
          Learn About Us
        </button>
      </div>
      </div>
    </div>
  );
};

export default Home;
