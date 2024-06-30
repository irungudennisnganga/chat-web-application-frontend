import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import { ReactTyped } from 'react-typed';

function Conversations({ user }) {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt'); // Retrieve the JWT token from local storage

    fetch('http://127.0.0.1:5555/conversations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the JWT token in the headers
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setConversations(data.conversations); // Assuming `data.conversations` contains an array of conversation objects
        } else if (data.status === 201) {
          navigate("/add-conversations"); // Redirect if no conversations exist
        } else {
          console.error('Error fetching conversations:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, [navigate]);

  const handleConversationClick = (conversationId) => {
    navigate(`/conversations/${conversationId}`); // Navigate to the conversation detail page
  };

  const handleAddConversationClick = () => {
    navigate('/add-conversations');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6 relative">
      <h1 className="text-2xl font-semibold mb-4">
        <ReactTyped 
          className="p-2 text-xl font-bold inline-block text-cyan-500" 
          strings={["Conversations"]} 
          showCursor={false} 
          typeSpeed={40} 
          backSpeed={50} 
        />
      </h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {conversations.map(conversation => (
          <div key={conversation.id} className="bg-white rounded-lg shadow-md p-4 cursor-pointer" onClick={() => handleConversationClick(conversation.id)}>
            <div className="mt-2">
              {conversation.user_1.id !== conversation.user_2.id ? (
                <>
                  {conversation.user_1.id === user.user_id && (
                    <>
                      <p className="text-gray-600">Username: {conversation.user_2.username}</p>
                      <p className="text-gray-600">Email: {conversation.user_2.email}</p>
                      <img
                        src={conversation.user_2.profile_picture || 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'}
                        alt={conversation.user_2.username}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    </>
                  )}
                  {conversation.user_2.id === user.user_id && (
                    <>
                      <p className="text-gray-600">Username: {conversation.user_1.username}</p>
                      <p className="text-gray-600">Email: {conversation.user_1.email}</p>
                      <img
                        src={conversation.user_1.profile_picture || 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'}
                        alt={conversation.user_1.username}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-600">Username: {conversation.user_1.username}</p>
                  <p className="text-gray-600">Email: {conversation.user_1.email}</p>
                  <img
                    src={conversation.user_1.profile_picture || 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={conversation.user_1.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={handleAddConversationClick}
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
}

Conversations.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    contact: PropTypes.number.isRequired,
    profile_picture: PropTypes.string,
  }).isRequired,
};

export default Conversations;
