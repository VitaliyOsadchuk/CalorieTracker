// src/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
    <div className="insideContainer">
      <div className="header">
        <h1>Калькулятор калорій</h1>
      </div>
      <div className="btnContainer">
        <button className="home-btn" onClick={() => navigate('/register')} aria-label="Реєстрація">
          Реєстрація
        </button>
        <button className="home-btn" onClick={() => navigate('/login')} aria-label="Вхід">
          Вхід
        </button>
      </div>
    </div>
    </div>
  );
};

export default HomePage;
