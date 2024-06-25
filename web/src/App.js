import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import search from './Assets/search.svg';
import camera from './Assets/camera.svg';
import threeDots from './Assets/three-dots-.svg';
import Swal from 'sweetalert2';
import OTPVerification from './OTPVerification';
import Login from './Login';
import Signup from './Signup';
import Welcome from './Welcome';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current;
      video.srcObject = stream;
      video.autoplay = true;
      setShowCaptureButton(true); // Show the capture button
      Swal.fire({
        title: 'Success!',
        text: 'Do you want to continue?',
        icon: 'success',
        confirmButtonText: 'Cool'
      });
    } catch (error) {
      // Add a notification for the user
      console.error('Error accessing the camera: ', error);
      Swal.fire({
        title: 'Error!',
        text: 'Could not open camera!',
        icon: 'error',
        confirmButtonText: 'Cool'
      });
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame from video onto canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas data to image data URL
    const imageDataURL = canvas.toDataURL('image/png');

    // Set the captured image in state
    setCapturedImage(imageDataURL);
  };

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    // console.log(jwt)
    if (jwt) {
      fetch('http://127.0.0.1:5555/check_session', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            
            return response.text().then(text => { throw new Error(text) });
          }
        })
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error('Error checking session:', error);
          localStorage.removeItem('jwt');  // Clear JWT as the session is no longer valid
          navigate('/login');
          setUser(null);  // Clear user state
          
        });
    }
  }, [navigate]);

  return (
    <>
      {/* <div className="App bg-green-500 ">
        <h1 className="text-3l font-bold padding-top: 0.25rem text-gray-200">CHAT COMMUNITY</h1>
        
        <img className='search' src={search} alt='search'/>
        <img className='camera' src={camera} alt='camera' onClick={openCamera} />
        <img className='dots' src={threeDots} alt='three dots'/>

        
      </div> */}
      
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/otp-verification/:phoneNumber" element={<OTPVerification />} />
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/" element={<Welcome />} />
      </Routes>
    </>
  );
}

export default App;
