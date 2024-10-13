import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import ReactMarkdown from 'react-markdown'; // Import react-markdown for parsing markdown
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Add user message to the chat
    setMessages((prev) => [...prev, { user: input, bot: '' }]);

    // Call your AI API here
    try {
      const response = await axios.post('http://localhost:8081/api/query', {
        prompt: input,
      });
      const botResponse = response.data.answer; // Adjust this based on your API response structure

      // Update the messages state with the bot's response
      setMessages((prev) => [
        ...prev, // Remove the last user message
        { user: input, bot: botResponse } // Add the updated message with bot response
      ]);
    } catch (error) {
      console.error('Error fetching response from AI:', error);
      setMessages((prev) => [
        ...prev,
        { user: input, bot: 'Sorry, I could not fetch a response.' },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="sidebar">
        <h2>Fitness Trainer</h2>
        {/* <FaUserCircle size={50} /> */}
        <img
                src="../src/assets/img_1.png"
                alt="Bot Profile"
                className="profile-pic-lg"
              />
      </div>
      <div className="chat-area">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.bot ? 'bot-message' : 'user-message'}`}>
              {msg.bot ? (
                <ReactMarkdown className="bot-text">
                  {msg.bot}
                </ReactMarkdown>
              ) : (
                <div className="user-text">{msg.user}</div>
              )}

            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
                setInput('');
              }
            }}
          />
          <button className="inputChat" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
