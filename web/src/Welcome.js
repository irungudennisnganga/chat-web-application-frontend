import React from 'react';
import aiImage from './Assets/web.jpg';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {

    const navigate = useNavigate();

    const discover = () =>{
        navigate('/login')
      }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Chatting Application</h1>
      <p className="text-lg text-gray-700 mb-8">Start chatting with your friends and family!</p>
      <img src={aiImage} alt="AI" className="w-80 h-auto rounded-full shadow-md mb-8" />
      
        <div className="flex justify-center items-center ">
    <button onClick={discover} className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-14 w-56 rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold">
      <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
      <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
      <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
      <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
      <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
      <p className="z-10">Discover More</p>
    </button>
  </div>
      
    </div>
  );
};

export default Welcome;