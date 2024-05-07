import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate,useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
function Signup() {
  const { phoneNumber } = useParams()
  const [message, setMessage] = useState('');
  // const [email, setEmail] = useState('');
  // const [password_1, setPassword1] = useState('');
  // const [password_2, setPassword2] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password_1:'',
    contact:'',
    email:'',
    password_2:'',
    
});
// const history = useHistory();
  const navigate = useNavigate();

  const handleUserNameChange = (event) => {
    setFormData({
        ...formData,
        username: event.target.value
    });
}

const handleEmailChange = (event) => {
  setFormData({
      ...formData,
      email: event.target.value
  });
}
const handlePhoneChange = (phoneNumber) => {
  if (phoneNumber === undefined) {
      // This is triggered when the phone number is deleted
      // You can handle this case if needed
      return;
  }

  const cleanedPhoneNumber = phoneNumber
  setFormData({
      ...formData,
      contact: cleanedPhoneNumber
  });
}
const handlePassword1 = (event) => {
  setFormData({
      ...formData,
      password_1: event.target.value
  });
}
const handlePassword2 = (event) => {
  setFormData({
      ...formData,
      password_2: event.target.value
  });
}



  // const otp = () => {
  //   if(formData){
  //     navigate(`/otp-verification/${formData.contact}`);
  //     try {
  //       const response = await axios.post('http://127.0.0.1:5555/verify_otp', {formData });
  //       setMessage(response.data.message);
  //       navigate('/conversations')
  //   } catch (error) {
  //       console.error('Error verifying OTP:', error);
  //   })
  //     console.log(formData);
  //   }
    
  
  // };
  const otp = async () => {
    
    try {
        const response = await axios.post('http://127.0.0.1:5555/create_account', formData);
        setMessage(response.data.message);
        navigate(`/otp-verification/${formData.contact}`);
    } catch (error) {
        console.error('Error verifying OTP:', error);
    }
};
console.log(message)

  return (
    <div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-black mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto text-white">
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className="font-semibold text-sm text-gray-400 pb-1 block"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  id="username"
                  value={formData.username}
                  required
                  onChange={handleUserNameChange}
                />
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-400 pb-1 block"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  type="email"
                  required
                  id="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-400 pb-1 block"
                  htmlFor="phone_number"
                >
                  Phone Number
                </label>
                <PhoneInput
                        id="contact"
                        international
                        className="form-input mt-1 block ml-2 flex-none w-64"
                        defaultCountry="KE"
                        limitMaxLength // Limit input to maximum length
                        maxLength={15}
                        value={formData.contact}
                        onChange={handlePhoneChange}
                        required
                    />
              </div>
              <br />
              <div>
                <label
                  className="font-semibold text-sm text-gray-400 pb-1 block"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  type="password"
                  id="password"
                  required
                  value={formData.password_1}
                  onChange={handlePassword1}
                />
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-400 pb-1 block"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  type="password"
                  id="confirm-password"
                  required
                  value={formData.password_2}
                  onChange={handlePassword2}
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div>
                <button className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                  <svg
                    viewBox="0 0 24 24"
                    height="25"
                    width="25"
                    y="0px"
                    x="0px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* SVG Path for Google Icon */}
                  </svg>
                  <span className="ml-2">Sign up with Google</span>
                </button>
                <button className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg mt-4">
                  <svg
                    viewBox="0 0 30 30"
                    height="30"
                    width="30"
                    y="0px"
                    x="0px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* SVG Path for Apple Icon */}
                  </svg>
                  <span className="ml-2">Sign up with Apple</span>
                </button>
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={otp}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                type="submit"
              >
                Sign up
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <a
                className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                href="login"
              >
                have an account? Log in
              </a>
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
