import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({});
  const [editField, setEditField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        const response = await axios.get('http://127.0.0.1:5555/check_session', {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
        
        setUser(response.data);
      } catch (error) {
        console.error('Error checking session', error);
        localStorage.removeItem('jwt'); // Clear JWT if there's an error
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = (field) => {
    setEditField(field);
    setInputValue(user[field]);
  };

  const handleUpdate = async (field) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await axios.post(`http://127.0.0.1:5555/api/update/${field}`, 
        { value: inputValue },
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );
      setUser((prevUser) => ({ ...prevUser, [field]: response.data[field] }));
      setEditField(null);
    } catch (error) {
      console.error(`Error updating ${field}`, error);
    }
  };

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleProfileImageUpload = async () => {
    try {
      const jwt = localStorage.getItem('jwt');
      const formData = new FormData();
      formData.append('profile_picture', profileImage);
      
      const response = await axios.post('http://127.0.0.1:5555/api/update/profile_picture', formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser((prevUser) => ({ ...prevUser, profile_picture: response.data.profile_picture }));
      setProfileImage(null);
    } catch (error) {
      console.error('Error uploading profile picture', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`max-w-3xl mx-auto p-4 ${theme === 'light' ? 'text-black' : theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <h1 className="text-3xl font-semibold mb-6 ">Profile</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-grow">
            <label className="block text-yellow-500 text-sm font-bold mb-2 capitalize">Profile Picture</label>
            <div className="flex items-center">
              <img
                src={user.profile_picture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              {/* Remove Edit Button Here */}
            </div>
          </div>
        </div>
        {Object.entries(user).map(([key, value]) => {
          if (key === 'user_id' || key === 'email' || key === 'profile_picture') return null;
          return (
            <div key={key} className="flex items-center justify-between p-4 border-b">
              <div className="flex-grow">
                <label className="block text-yellow-500 text-sm font-bold mb-2 capitalize">{key}</label>
                {editField === key ? (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                ) : (
                  <p className="text-lg">{value}</p>
                )}
              </div>
              {editField === key ? (
                <button
                  onClick={() => handleUpdate(key)}
                  className={`ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(key)}
                  className={`ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                  Edit
                </button>
              )}
            </div>
          );
        })}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-grow">
            <label className="block text-yellow-500 text-sm font-bold mb-2">Change Profile Picture</label>
            <input
              type="file"
              onChange={handleProfileImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {profileImage && (
            <button
              onClick={handleProfileImageUpload}
              className={`ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
