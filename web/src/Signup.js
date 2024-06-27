import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const { phoneNumber } = useParams();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password_1: '',
    phone_number: '',
    email: '',
    password_2: ''
  });
  const [image, setImage] = useState(null);
  const notify = () => toast("Signup successful 👌");
  const [usernameValid, setUsernameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [password1Valid, setPassword1Valid] = useState(true);
  const [password2Valid, setPassword2Valid] = useState(true);
  const navigate = useNavigate();

  const handleUserNameChange = (event) => {
    const username = event.target.value;
    setFormData({ ...formData, username });
    setUsernameValid(!!username.trim());
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setFormData({ ...formData, email });
    setEmailValid(validateEmail(email));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handlePhoneChange = (phone_number) => {
    setFormData({ ...formData, phone_number });
    setPhoneValid(!!phone_number);
  };

  const handlePassword1Change = (event) => {
    const password_1 = event.target.value;
    setFormData({ ...formData, password_1 });
    setPassword1Valid(!!password_1);
  };

  const handlePassword2Change = (event) => {
    const password_2 = event.target.value;
    setFormData({ ...formData, password_2 });
    setPassword2Valid(password_2 === formData.password_1);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid = () => {
    return (
      formData.username.trim() &&
      validateEmail(formData.email) &&
      formData.phone_number &&
      formData.password_1 &&
      formData.password_2 &&
      formData.password_1 === formData.password_2
    );
  };

  const otp = async () => {
    if (!isFormValid()) {
      alert('Please fill all the required fields correctly.');
      return;
    }

    const data = new FormData();
    data.append('username', formData.username);
    data.append('password_1', formData.password_1);
    data.append('phone_number', formData.phone_number);
    data.append('email', formData.email);
    data.append('password_2', formData.password_2);
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5555/create_account', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      setMessage(response.status);
      notify();
      navigate(`/otp-verification/${formData.phone_number}`);
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('Signup failed. Please try again.');
    }
  };

  return (
    <div>
      <div className='big flex justify-evenly items-center mt-16 mb-3'>
        <ToastContainer />
      </div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto mt-24">
        <div className="relative px-4 py-10 bg-black mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto text-white">
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-semibold text-sm text-gray-400 pb-1 block" htmlFor="username">
                  Username
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${usernameValid ? '' : 'border-red-500'}`}
                  required
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleUserNameChange}
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-400 pb-1 block" htmlFor="email">
                  Email
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${emailValid ? '' : 'border-red-500'}`}
                  required
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-400 pb-1 block" htmlFor="phone_number">
                  Phone Number
                </label>
                <PhoneInput
                  id="phone_number"
                  required
                  international
                  className={`form-input mt-1 block ml-2 text-gray-400 flex-none w-64 ${phoneValid ? '' : 'border-red-500'}`}
                  defaultCountry="KE"
                  limitMaxLength
                  maxLength={15}
                  onChange={handlePhoneChange}
                />
              </div>
              <br />
              <div>
                <label className="font-semibold text-sm text-gray-400 pb-1 block" htmlFor="password">
                  Password
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${password1Valid ? '' : 'border-red-500'}`}
                  required
                  type="password"
                  id="password"
                  value={formData.password_1}
                  onChange={handlePassword1Change}
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-400 pb-1 block" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${password2Valid ? '' : 'border-red-500'}`}
                  required
                  type="password"
                  id="confirm-password"
                  value={formData.password_2}
                  onChange={handlePassword2Change}
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-400 pb-1 block" htmlFor="image">
                  Profile Picture
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
                  required
                  type="file"
                  id="image"
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={otp}
                disabled={!isFormValid()}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                type="button"
              >
                Sign up
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <a
                className="text-xs text-gray-500 uppercase text-cyan-400 hover:underline"
                href="login"
              >
                Have an account? Log in
              </a>
              <span className="w-1/5 border-b text md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
