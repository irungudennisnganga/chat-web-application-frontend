import React from 'react';
import aiImage from '../Assets/web.jpg';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from "react-typed";
import Navbar from '../components/NavBar';

const Welcome = () => {
  const navigate = useNavigate();

  const discover = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar />
    
    <div className="flex flex-col items-center justify-center h-screen  bg-gray-100 p-4 md:p-8 lg:p-12">
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl   font-bold mb-4 md:mb-8 text-black text-center">
        Welcome to Our
        <ReactTyped
          className="p-2 text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-8 inline-block text-cyan-500"
          strings={[
            "Chatting Application💬",
            "Platform for Real-Time Conversations⌚",
            "Platform to Connect with Friends😎",
            "Hub for Secure Messaging🔐",
          ]}
          showCursor={false}
          typeSpeed={40}
          backSpeed={50}
          loop
        />
        
      </h1>
      {/* <ReactTyped
        className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-4 md:mb-8 inline-block text-center"
        strings={[
          "Start chatting with your friends!",
          "Start chatting with your family!",
          "Start chatting with your colleagues!",
          "Start chatting with your loved ones!",
        ]}
        showCursor={false}
        typeSpeed={40}
        backSpeed={50}
        loop
      /> */}
      <img src={aiImage} alt="AI" className="w-40 md:w-60 lg:w-80 h-auto rounded-full shadow-md mb-4 md:mb-8" />
      <div className="flex justify-center items-center">
        <button
          onClick={discover}
          className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-14 w-40 md:w-48 lg:w-56 rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold"
        >
          <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
          <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
          <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
          <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
          <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
          <p className="z-10">Discover</p>
        </button>
      </div>
    </div>
    </>
  );
};

export default Welcome;
