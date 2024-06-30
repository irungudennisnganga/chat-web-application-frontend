import React, { useState, useRef } from 'react';
import axios from 'axios';
import './OTPverification.css';
import { useNavigate, useParams } from 'react-router-dom';

const OTPVerification = () => {
  const [otpDigits, setOTP] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { phoneNumber } = useParams();
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOTP = [...otpDigits];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value !== '' && index < otpDigits.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (index === otpDigits.length - 1 && newOTP.every(digit => digit !== '')) {
      handleVerify(newOTP.join(''));
    }
  };

  const handleVerify = async (otp) => {
    try {
      const response = await axios.post('http://127.0.0.1:5555/verify_otp', { phone_number: phoneNumber, otp });
      // check the response status before navigating
      setMessage("Successfull");
      navigate('/login');
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Error verifying OTP. Please try again.');
    }
  };
//   console.log(message)
  const handleClear = () => {
    setOTP(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
  };

  const renderInputs = () => {
    return otpDigits.map((digit, index) => (
      <input
        key={index}
        maxLength="1"
        type="tel"
        value={digit}
        onChange={(e) => handleChange(index, e.target.value)}
        ref={(el) => (inputRefs.current[index] = el)}
        required
      />
    ));
  };

  return (
    <form className="form ml-auto mr-auto mt-16">
      <span className="close">X</span>

      <div className="info">
        <span className="title">Two-Factor Verification</span>
        <p className="description">
          Enter the two-factor authentication code from your email
        </p>
      </div>

      <div className="input-fields">{renderInputs()}</div>

      <div className="action-btns">
        <button type="button" className="verify" onClick={() => handleVerify(otpDigits.join(''))}>
          Verify
        </button>
        <button type="button" className="clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default OTPVerification;
