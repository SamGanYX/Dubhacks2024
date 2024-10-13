import React, { useState } from 'react'; 
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import './ChatBot.css'; // Make sure to style your components with this CSS file

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Add user message to the chat
    setMessages((prev) => [...prev, { user: input, bot: '' }]);

    // Call your Perplexity AI API here
    try {
      const response = await axios.post('https://api.perplexity.ai/v1/query', {
        query: input,
      });
      const botResponse = response.data.answer; // Adjust based on your API response structure
      
      // Update the messages state with the bot's response
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the last user message
        { user: input, bot: botResponse } // Add the updated message
      ]);
    } catch (error) {
      console.error('Error fetching response from Perplexity AI:', error);
      setMessages((prev) => [
        ...prev,
        { user: input, bot: 'Sorry, I could not fetch a response.' },
      ]);
    }

    // Clear the input field
    setInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="sidebar">
        <h2>Fitness Trainer</h2>
        <FaUserCircle size={50} />
      </div>
      <div className="chat-area">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.bot ? 'bot-message' : 'user-message'}`}>
              {msg.bot && (
                <img src="path_to_your_bot_profile_pic.jpg" alt="Bot Profile" className="profile-pic" />
              )}
              <div className={msg.bot ? 'bot-text' : 'user-text'}>
                {msg.bot ? msg.bot : msg.user}
              </div>
              {!msg.bot && (
                <img src="path_to_your_user_profile_pic.jpg" alt="User Profile" className="profile-pic" />
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
              }
            }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
