import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import threeDots from '../Assets/three-dots-.svg';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Navbar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  if (!user) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between">
        <p className="text-lg font-semibold">Loading...</p>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={user.profile_picture || 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={user.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
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
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
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
