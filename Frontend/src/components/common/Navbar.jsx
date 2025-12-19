import React, { useState, useEffect } from "react";
import logo from "../../../public/logo.png";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <>
      {/* NAVBAR */}
      <div
        className="
          fixed top-4 left-4 right-4
          md:left-32 md:right-32
          rounded-3xl shadow-md
          flex justify-between items-center
          px-4 py-3 text-black
          bg-white border z-50
        "
      >
        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img src={logo} alt="Logo" className="h-9 w-9 md:h-10 md:w-10" />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-4 text-sm font-medium">
          <li
            className="cursor-pointer hover:bg-gray-200 py-2 px-4 rounded-md"
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className="cursor-pointer hover:bg-gray-200 py-2 px-4 rounded-md"
            onClick={() => navigate("/aboutUs")}
          >
            About Us
          </li>
          <li
            className="cursor-pointer hover:bg-gray-200 py-2 px-4 rounded-md"
            onClick={() => navigate("/contactUs")}
          >
            Contact Us
          </li>
        </ul>

        {/* Desktop Button */}
        <button
          className="hidden md:block rounded-lg bg-gray-800 px-6 py-2 font-semibold text-white hover:bg-gray-700"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md bg-white outline-none focus:outline-none"
          onClick={() => setOpen(true)}
        >
          <Menu size={24} className="fill-black text-black" />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-3/4 sm:w-1/2
          bg-white z-50 shadow-xl text-black
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close Icon */}
        <div className="flex justify-end p-6">
          <X
            size={24}
            className="cursor-pointer "
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col items-end gap-6 px-8 text-lg font-medium">
          <p
            className="cursor-pointer hover:text-indigo-600"
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
          >
            Home
          </p>

          <p
            className="cursor-pointer hover:text-indigo-600"
            onClick={() => {
              navigate("/aboutUs");
              setOpen(false);
            }}
          >
            About Us
          </p>

          <p
            className="cursor-pointer hover:text-indigo-600"
            onClick={() => {
              navigate("/contactUs");
              setOpen(false);
            }}
          >
            Contact Us
          </p>

          <button
            className="mt-6 rounded-lg bg-gray-800 px-6 py-2 font-semibold text-white hover:bg-gray-700"
            onClick={() => {
              navigate("/signup");
              setOpen(false);
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
