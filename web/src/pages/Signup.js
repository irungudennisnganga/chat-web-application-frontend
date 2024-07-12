import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/NavBar';

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
  const notify = () => toast("Signup Successful 👌.Continue To Email Verification");
  const notify2 = () => toast("Enter all the required data");
  const notify3 = () => toast("The credentials that you are using seems to be taken, change them to continue");

  const [usernameValid, setUsernameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [password1Valid, setPassword1Valid] = useState(true);
  const [password2Valid, setPassword2Valid] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
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

    setIsLoading(true); // Start loading indicator

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
      setMessage(response.status);
      notify();
      setTimeout(() => {
        navigate(`/otp-verification/${formData.phone_number}`);
      }, 3000);  
      
    } catch (error) {
      console.error('Error during signup:', error.response.status);
      if(error.response.status===400){
        notify2()
      }else if(error.response.status=== 409){
        notify3()
      }
      setMessage('Signup failed. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading indicator regardless of success or failure
    }
  };

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className='big flex justify-evenly items-center  mb-3'>
        
      </div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto mt-16">
        <div className="relative px-4 py-10 bg-black mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          {/* <h2>sign up</h2> */}
          <div className="max-w-md mx-auto text-white">
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-semibold text-sm text-white pb-1 block" htmlFor="username">
                  Username *
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-green-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${usernameValid ? '' : 'border-red-500'}`}
                  required
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleUserNameChange}
                  
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-white pb-1 block" htmlFor="email">
                  Email *
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-green-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${emailValid ? '' : 'border-red-500'}`}
                  required
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-white pb-1 block" htmlFor="phone_number">
                  Phone Number *
                </label>
                <PhoneInput
                  id="phone_number"
                  required
                  international
                  className={`form-input mt-1 block ml-2  text-green-500 flex-none w-64 ${phoneValid ? '' : 'border-red-500'}`}
                  defaultCountry="KE"
                  limitMaxLength
                  maxLength={15}
                  onChange={handlePhoneChange}
                />
              </div>
              <br />
              <div>
                <label className="font-semibold text-sm text-white pb-1 block" htmlFor="password">
                  Password *
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-green-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${password1Valid ? '' : 'border-red-500'}`}
                  required
                  type="password"
                  id="password"
                  value={formData.password_1}
                  onChange={handlePassword1Change}
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-white pb-1 block" htmlFor="confirm-password">
                  Confirm Password *
                </label>
                <input
                  className={`border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-green-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${password2Valid ? '' : 'border-red-500'}`}
                  required
                  type="password"
                  id="confirm-password"
                  value={formData.password_2}
                  onChange={handlePassword2Change}
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-white pb-1 block" htmlFor="image">
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
                disabled={!isFormValid() || isLoading} 
                className="signup py-2 px-4 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                type="button"
              >
                {isLoading ? 'Signing up...' : 'Sign up'} {/* Show loading text if loading */}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <a
                className="text-xs text-gray-400 uppercase  hover:underline"
                href="login"
              >
                Have an account ? <span className='text-cyan-400'>Log in .....</span>
              </a>
              
              <span className="w-1/5 border-b text md:w-1/4"></span>
            </div>
            <p className='text-center'>
        <a href='fogotten-password' className='sign'>Fogotten password !</a> </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
