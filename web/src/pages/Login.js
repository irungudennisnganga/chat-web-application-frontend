import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const notify = () => toast("Login successful 👌");
  const notify2 = () => toast("Login Request Not successful");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5555/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // console.log('Raw response:', response);
      // console.log('Response data:', response.data);

      if (response.data && response.data.access_token) {
        localStorage.removeItem('jwt'); 
        const data =  response.data.access_token;
        // console.log(data)
        localStorage.setItem('jwt', data);
        notify();
        setTimeout(() => {
          navigate('/conversations');
        }, 2000);  // Delay navigation to ensure the toast is visible
      } else {
        setMessage('Login failed. Please try again.');
        
      }
    } catch (error) {
      console.error('Error during login:', error);
      notify2();
        
      setMessage('Wrong Credentials! Please try again');
    }
  };

  return (
    <div className="login-box">
      <ToastContainer />
      <p>Login</p>
      <form onSubmit={handleLogin}>
        <div className="user-box">
          <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label>Email</label>
        </div>
        <div className="user-box">
          <input
            required
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <label>Password</label>
        </div>
        <button type="submit">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Submit
        </button>
        {message && <h1 className='text-white mt-4 mb-4'>{message}</h1>}
      </form>
      <p>Don't have an account? <a href="signup" className="a2 sign text-cyan-400">Sign up!</a></p>
    </div>
  );
};

export default Login;
