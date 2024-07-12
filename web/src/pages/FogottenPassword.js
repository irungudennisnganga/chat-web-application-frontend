import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch('http://127.0.0.1:5555/check-user-forgotten-password', { email }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setShowPasswordFields(true);
        setMessage('Please enter your new password.');
      } else if (response.status === 404) {
        toast.error('User not found.');
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.patch('http://127.0.0.1:5555/update-password', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setMessage('Password updated successfully.');
        toast.success('Password updated successfully.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (response.status === 404){
        toast.success('Password updated successfully.');
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <Navbar />
        <form onSubmit={handleEmailSubmit} className="w-full max-w-md">
          <h2 className="text-2xl text-blue-500 font-bold mb-4">Forgot Password</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>

        {showPasswordFields && (
          <form onSubmit={handlePasswordSubmit} className="w-full max-w-md mt-8">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Password
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-red-500 text-sm font-semibold">{message}</p>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
