// NotFound.js
import React from "react";
import { Link } from "react-router-dom"; // remove if not using react-router

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-blue-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 hover:text-white text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
