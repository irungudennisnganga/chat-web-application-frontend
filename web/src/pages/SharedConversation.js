import React, { useEffect, useState, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';
import notificationSound from '../Assets/level-up.mp3'
import { FaArrowDown } from 'react-icons/fa';
const ENDPOINT = 'http://localhost:5555'; // Your Flask-SocketIO server endpoint

function SharedConversation() {
  const { id: conversationId } = useParams(); // Extract conversationId from URL params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const theme = localStorage.getItem('theme'); // Use the theme context
  const [selectedFile, setSelectedFile] = useState(null); // State to manage selected file
  const [initialMessageLength, setInitialMessageLength] = useState();
  const messagesEndRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [conversationId]);

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
      if (formattedMessage.length !== initialMessageLength) {
        const audio = new Audio(notificationSound);
        audio.play();
        setInitialMessageLength(formattedMessage.length);
      }
      setMessages(prevMessages => [...prevMessages, formattedMessage]);
      scrollToBottom();
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
        }));
        localStorage.setItem('messages', formattedMessages.length)

        setInitialMessageLength(parseInt(formattedMessages.length, 10));
        const num = localStorage.getItem("number")
        const mess = localStorage.getItem("messages")
        
        setMessages(formattedMessages);
        setLoading(false);
        scrollToBottom();
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
        const audio = new Audio(notificationSound);
        audio.play();
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
          fetchMessages();
          scrollToBottom();
        } else {
          console.error('Received message with undefined or null timestamp:', data);
        }
        setNewMessage(''); // Clear the input field
      })
      .catch(error => console.error('Error sending message:', error));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSendFile = () => {
    if (!selectedFile) return;

    const token = localStorage.getItem('jwt');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('conversation_id', conversationId);

    fetch(`${ENDPOINT}/messages/${conversationId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        return response.json();
      })
      .then(data => {
        setMessages(prevMessages => [...prevMessages, data]);
        setSelectedFile(null); // Clear the selected file
        scrollToBottom();
      })
      .catch(error => console.error('Error uploading file:', error));
  };

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // return <div ref={messagesEndRef}></div> 
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setShowScrollToBottom(false);
    } else {
      setShowScrollToBottom(true);
    }
  };

  return (
    <div className={`flex flex-col h-screen  ${theme === 'light' ? 'bg-white' : theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white'}`}>
      <div className="flex-grow overflow-y-auto p-4 mt-16" onScroll={handleScroll}>
        {loading ? (
          <p className="text-center">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center">No messages yet</p>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`flex mb-2 ${message.sender.id === user?.user_id ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded ${message.sender.id === user?.user_id ? (theme === 'light' ? 'bg-blue-200' : theme === 'dark' ? 'bg-blue-700' : 'bg-green-400') : (theme === 'light' ? 'bg-gray-200' : theme === 'dark' ? 'bg-gray-700' : 'bg-blue-400')}`}>
                <p>{message.content}</p>
                <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : theme === 'dark' ? 'text-gray-300' : 'text-white'}`}>{new Date(message.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
        { !showScrollToBottom && <div ref={messagesEndRef}></div>}
        {/* { !showScrollToBottom && <div ref={messagesEndRef}></div>} */}
      </div>
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-16 right-4 p-2 bg-blue-500 text-white rounded-full shadow-md"
        >
          <FaArrowDown />
        </button>
      )}
      
      <div className="p-4 border-t border-gray-300 flex space-x-4">
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className={`flex-grow p-2 border rounded ${theme === 'light' ? 'bg-white' : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-blue-300 text-white'}`}
        />
        <input 
          type="file" 
          onChange={handleFileChange}
          className="hidden" 
          id="fileInput"
        />
        <label htmlFor="fileInput" className={`cursor-pointer p-2 rounded ${theme === 'light' ? 'bg-gray-200' : theme === 'dark' ? 'bg-gray-700' : 'bg-blue-400'}`}>
          <FaImage />
        </label>
        <button 
          onClick={handleSendMessage}
          className={`p-2 rounded font-bold ${theme === 'light' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-400 text-white'}`}
        >
          Send
        </button>
        <button 
          onClick={handleSendFile}
          className={`p-2 rounded font-bold ${theme === 'light' ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-400 text-white'}`}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default SharedConversation;
