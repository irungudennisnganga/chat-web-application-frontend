import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from "react-typed";

function AddConversation({user}) {
  // console.log(user.user_id)
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
     // Retrieve the JWT token from local storage

    fetch('http://127.0.0.1:5555/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the JWT token in the headers
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
  
  // console.log(user_2)
  const startConversation = (userId) => {
    fetch(`http://127.0.0.1:5555/new_conversation/${userId}` , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the JWT token in the headers
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 201 || data.status === 200) {
        // console.log(data.connection_id)
        navigate(`/conversations/${data.connection_id}`);
        // setConversation(data.connection_id);
      } else {
        console.error('Error fetching users:', data.message);
      }
    })
    .catch(error => console.error('Fetch error:', error));
    
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-2xl font-bold mb-4">
        <ReactTyped 
        className="p-2 text-xl font-bold  inline-block text-cyan-500" 
        strings={[
          "Start New Conversations",
          
        ]} 
        showCursor={false} 
        typeSpeed={40} 
        backSpeed={50} 
         
      /></h1>
      <ul className="space-y-2">
        {users.map(user => (
          <li
            key={user.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => startConversation(user.id)}
          >
            <div className="flex items-center">
              <img
                src={user.profile_picture || 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="text-lg font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddConversation;
