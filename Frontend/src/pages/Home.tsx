import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css';

function App() {
  const navigate = useNavigate(); // Initialize useNavigate
  const userID = localStorage.getItem("userID");

  return (
    <div className="app">
      <div className="title-section">
        <h1 className="eatvolution-title">
          Eat<span className="green-text">volution</span>
        </h1>
        <div className="welcome-section">
        <h1>Welcome to Your Personal Fitness Assistant</h1>
      </div>
      </div>
      {(userID==null) && <div className="button-section">
        <button className="login-button" onClick={() => navigate('/login')}>Login</button>
        <button className="signup-button" onClick={() => navigate('/create_account')}>Sign-up</button>
      </div>}
    </div>
  );
}

export default App;
