import React, { useState, useEffect } from 'react';
import {  Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import OTPVerification from './pages/OTPVerification';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import Conversations from './pages/Conversations';
import AddConversation from './pages/AddConversation';
import SharedConversation from './pages/SharedConversation';
import NavBar from './components/NavBar';
import {ThemeProvider}  from './pages/ThemeContext'; // Import ThemeProvider
import Profile from './pages/Profile';
import ForgotPassword from './pages/FogottenPassword';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store current user
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user from conversation click
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
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
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/signup' || currentPath.startsWith('/otp-verification')) {
            localStorage.removeItem('jwt'); // Clear JWT for login, signup, or otp verification
          } else {
            // localStorage.setItem('user', JSON.stringify(userData)); // Save user data in local storage for other paths
          }
        })
        .catch(error => {
          console.error('Error checking session:', error);
          localStorage.removeItem('jwt');  // Clear JWT as the session is no longer valid
          navigate('/login');
          setUser(null);  // Clear user state
        });
    } 
    // else {
    //   // navigate('/login'); // If no JWT found, redirect to login page
    // }
  }, [navigate]); // Include navigate in dependency array to suppress React warnings

  const handleConversationClick = (clickedUser) => {
    setSelectedUser(clickedUser); // Update selected user state
    navigate(`/conversations/${clickedUser.user_id}`);
  };

  return (
    <ThemeProvider>
      <>
        {user ? <NavBar user={selectedUser || user} /> : null} 
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/otp-verification/:phoneNumber" element={<OTPVerification />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/conversations" element={<Conversations user={user} onConversationClick={handleConversationClick} />} />
          <Route path="/add-conversations" element={<AddConversation user={user} />} />
          <Route path="/fogotten-password" element={<ForgotPassword />} />
          
          <Route path="/conversations/:id" element={<SharedConversation users={user} />} />
          <Route exact path="/" element={<Welcome />} />
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App;
