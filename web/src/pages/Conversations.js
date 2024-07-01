import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import { ReactTyped } from 'react-typed';

function Conversations({ user }) {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const theme = localStorage.getItem('theme') || 'light'; // Fetch theme from local storage

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    fetch('http://127.0.0.1:5555/conversations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setConversations(data.conversations);
        } else if (data.status === 201) {
          navigate("/add-conversations");
        } else {
          console.error('Error fetching conversations:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, [navigate]);

  const handleConversationClick = (conversationId) => {
    // console.log(user.user_id !== conversationId.user_2.id)
    if(user.user_id === conversationId.user_1.id){
        localStorage.setItem('user', JSON.stringify(conversationId.user_2))
    }else if(user.user_id === conversationId.user_2.id){
        localStorage.setItem('user', JSON.stringify(conversationId.user_1))
    }
// console.log(user,conversationId)
    navigate(`/conversations/${conversationId.id}`);
  };

  const handleAddConversationClick = () => {
    localStorage.removeItem('user');
    navigate('/add-conversations');
  };
// localStorage.clear()
  return (
    <div className={`container mx-auto px-4 py-8 mt-12 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
      <h1 className="text-2xl font-semibold mb-4">
        <ReactTyped
          className={`p-2 text-xl font-bold inline-block ${theme === 'light' ? 'text-cyan-500' : theme === 'dark' ? 'text-yellow-500' : 'text-yellow-500'}`}
          strings={["Conversations"]}
          showCursor={false}
          typeSpeed={40}
          backSpeed={50}
        />
      </h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {conversations.map(conversation => (
          <div key={conversation.id} className={`bg-white rounded-lg shadow-md p-4 cursor-pointer ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-green-300 text-white'}`} onClick={() => handleConversationClick(conversation)}>
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
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
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
