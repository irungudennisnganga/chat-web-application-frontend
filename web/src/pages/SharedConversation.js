import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useParams } from 'react-router-dom';

const ENDPOINT = 'http://localhost:5555'; // Your Flask-SocketIO server endpoint

function SharedConversation() {
  const { id: conversationId } = useParams(); // Extract conversationId from URL params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      fetch(`${ENDPOINT}/check_session`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.text().then(text => { throw new Error(text) });
          }
        })
        .then(userData => {
          setUser(userData);
          connectToSocket(jwt);
        })
        .catch(error => {
          console.error('Error checking session:', error);
          localStorage.removeItem('jwt');  // Clear JWT as the session is no longer valid
          setUser(null);  // Clear user state
        });
    }
  }, []);

  const connectToSocket = (token) => {
    // Initialize SocketIO connection
    const socket = socketIOClient(ENDPOINT, {
      transports: ['websocket'], // Use websocket transport for SocketIO
      query: {
        token: token // Send token as query parameter for authentication
      }
    });

    socket.on('connect', () => {
      console.log('Connected to SocketIO server');
    });

    socket.on('receive_message', (data) => {
      const formattedMessage = {
        ...data,
        timestamp: new Date(data.timestamp.replace(' ', 'T')) // Replace space with 'T' for ISO 8601 format
      };
      setMessages(prevMessages => [...prevMessages, formattedMessage]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from SocketIO server');
    });

    // Fetch initial messages from the server
    fetchMessages();
  };

  const fetchMessages = () => {
    const token = localStorage.getItem('jwt');

    fetch(`${ENDPOINT}/messages/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        return response.json();
      })
      .then(data => {
        // Map received timestamps to Date objects
        const formattedMessages = data.map(message => ({
          ...message,
          timestamp: new Date(message.timestamp.replace(' ', 'T')) // Replace space with 'T' for ISO 8601 format
        }));
        setMessages(formattedMessages);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  };

  const handleSendMessage = () => {
    const token = localStorage.getItem('jwt');

    fetch(`${ENDPOINT}/messages/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: newMessage,
        conversation_id: conversationId
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        return response.json();
      })
      .then(data => {
        // Check if data.timestamp is defined and not null
        if (data.timestamp) {
          // Update state with the new message
          const formattedMessage = {
            ...data,
            timestamp: new Date(data.timestamp.replace(' ', 'T').replace(/ /g, 'T')) // Ensure ISO 8601 format
          };
          setMessages(prevMessages => [...prevMessages, formattedMessage]);
        } else {
          console.error('Received message with undefined or null timestamp:', data);
        }
        setNewMessage(''); // Clear the input field
      })
      .catch(error => console.error('Error sending message:', error));
      
  };

  return (
    <div className='mt-12 p-4'>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-y-auto">
        {loading ? (
          <p className="text-center">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center">No messages yet</p>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`flex mb-2 ${message.sender.id === user?.user_id ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded ${message.sender.id === user?.user_id ? 'bg-blue-200' : 'bg-gray-200'}`}>
                <p>{message.content}</p>
                <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex space-x-4">
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-grow p-2 border rounded"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default SharedConversation;
