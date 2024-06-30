import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight, FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import threeDots from '../Assets/three-dots-.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ user: propUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  useEffect(() => {
    document.body.className = theme; // Apply theme to body
    localStorage.setItem('theme', theme); // Save theme in local storage
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfile = () => {
    localStorage.removeItem('user');
    navigate('/profile');
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent event propagation
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownVisible) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownVisible]);

  const goBack = () => {
    localStorage.removeItem('user');
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
    localStorage.removeItem('user');
  };

  const switchTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    closeDropdown(); // Close dropdown after selecting theme
  };

  // Determine if Navbar should be displayed based on current location
  const shouldDisplayNavbar = () => {
    const currentPath = location.pathname;
    return !(currentPath === '/login' || currentPath === '/signup' || currentPath.startsWith('/otp-verification') || currentPath === '/' );
  };

  if (!user || !shouldDisplayNavbar()) {
    
    return null; // Return null if user is not loaded or Navbar should not be displayed
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 p-4 flex items-center justify-between shadow-md ${theme === 'light' ? 'bg-white text-black' : theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white'}`}>
      <div className="flex items-center">
        <img
          src={user.profile_picture || 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={user.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-sm">{user.email}</p>
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-gray-200">
          <FaArrowLeft />
        </button>
        <button onClick={goForward} className="p-2 rounded-full hover:bg-gray-200">
          <FaArrowRight />
        </button>
        <div className="relative">
          <img src={threeDots} alt="three dots" onClick={toggleDropdown} className="cursor-pointer" />
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Logout
              </button>
              <div className="border-t my-2"></div>
              <button
                onClick={() => switchTheme('light')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center"
              >
                <FaSun className="mr-2" /> Light Mode
              </button>
              <button
                onClick={() => switchTheme('dark')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center"
              >
                <FaMoon className="mr-2" /> Dark Mode
              </button>
              <button
                onClick={() => switchTheme('blue')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center"
              >
                <FaPalette className="mr-2" /> Blue Mode
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    contact: PropTypes.number.isRequired,
    profile_picture: PropTypes.string,
  }).isRequired,
};

export default Navbar;
