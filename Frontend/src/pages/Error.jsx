import React from 'react';

const Error = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="text-4xl text-white p-8 bg-red-600 bg-opacity-75 rounded-xl shadow-2xl transform transition duration-500 hover:scale-105 hover:bg-opacity-100">
        Error - We are sorry our server is down
      </div>
    </div>
  );
}

export default Error;
