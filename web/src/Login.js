import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
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
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axios.post('http://127.0.0.1:5555/login', formData);
      setMessage(response);
      
      
      // const data = await response.json();
      // console.log()
      // localStorage.setItem('jwt', response.d ata.access_token);
      navigate('/conversations');
    } catch (error) {
      // console.error('Error verifying OTP:', error);
      setMessage({'status':422})
      
    }
  };

  return (
    <div className="login-box">
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
        { message.status === 422  ?<h1 className='text-white mt-4 mb-4'>Wrong Credentials! Please try again</h1>: null}
      </form>
      <p>Don't have an account? <a href="signup" className="a2">Sign up!</a></p>
    </div>
  );
};

export default Login;
