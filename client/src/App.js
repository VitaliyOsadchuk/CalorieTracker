//App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage'; 
import Register from './Register';
import Login from './Login';
import UserProfile from './UserProfile'; 
import RedactProfile from './RedactProfile'; 
import CalorieCalculator from './CalorieCalculator'; 

const App = () => {
  return (
    <Router>
      <div >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/redactProfile" element={<RedactProfile />} /> 
          <Route path="/calorieCalculator" element={<CalorieCalculator />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
