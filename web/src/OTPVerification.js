import React, { useState } from 'react';
import axios from 'axios';
import './OTPverification.css';
import { useNavigate, useParams } from 'react-router-dom';


const OTPVerification = () => {
    const [otpDigits, setOTP] = useState(['', '', '', '', '', '']);
    // const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { phoneNumber } = useParams();


    const handleChange = (index, value) => {
        const newOTP = [...otpDigits];
        newOTP[index] = value;
        setOTP(newOTP);
    };
console.log(phoneNumber)
    const handleVerify = async () => {
        const otp = otpDigits.join('');
        console.log(otp);
        try {
            const response = await axios.post('http://127.0.0.1:5555/verify_otp', { phone_number: phoneNumber, otp });
            setMessage(response.data.message);
            navigate('/conversations')
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    const handleClear = () => {
        setOTP(['', '', '', '', '', '']);
    };

    const renderInputs = () => {
        return otpDigits.map((digit, index) => (
            <input
                key={index}
                maxLength="1"
                type="tel"
                placeholder=""
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                required
            />
        ));
    };

    return (
        <>
            <form className="form">
                <span className="close">X</span>

                <div className="info">
                    <span className="title">Two-Factor Verification</span>
                    <p className="description">
                        Enter the two-factor authentication code from your email
                    </p>
                </div>

                <div className="input-fields">{renderInputs()}</div>

                <div className="action-btns">
                    <button type="button" className="verify" onClick={handleVerify}>
                        Verify
                    </button>
                    <button type="button" className="clear" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            </form>
        </>
    );
};

export default OTPVerification;
