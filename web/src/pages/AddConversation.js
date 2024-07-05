import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from "react-typed";

function AddConversation({ user }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const theme = localStorage.getItem('theme') || 'light'; // Fetch theme from local storage

  useEffect(() => {
    fetch('http://127.0.0.1:5555/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 201 || data.status === 200) {
          setUsers(data.users);
        } else {
          console.error('Error fetching users:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const startConversation = (userId) => {
    // console.log(userId)
    fetch(`http://127.0.0.1:5555/new_conversation/${userId.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 201 || data.status === 200) {
          if(userId){
            localStorage.setItem('user', JSON.stringify(userId))
        }

          navigate(`/conversations/${data.connection_id}`);
        } else {
          console.error('Error starting conversation:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">
        <ReactTyped
          className={`p-2 text-xl font-bold inline-block ${theme === 'light' ? 'text-cyan-500' : theme === 'dark' ? 'text-yellow-500' : 'text-yellow-500'}`}
          strings={[
            "Start New Conversations"
          ]}
          showCursor={false}
          typeSpeed={40}
          backSpeed={50}
        />
      </h1>
      <ul className="space-y-2">
        {users.map(user => (
          <li
            key={user.id}
            className={`p-4 border rounded-lg cursor-pointer  ${theme === 'light' ? 'text-black hover:bg-gray-100' : theme === 'dark' ? 'text-white hover:bg-green-100 hover:text-black' : 'text-white hover:bg-green-100 hover:text-black'}`}
            onClick={() => startConversation(user)}
          >
            <div className="flex items-center">
              <img
                src={user.profile_picture || 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="text-lg font-semibold">{user.username}</p>
                <p className="text-sm text-white-500">{user.email}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddConversation;
