import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login successful:', response.data);
      
      // Зберігаємо токен в localStorage
      localStorage.setItem('token', response.data.token);
      
      // Перевірка токену
      //console.log(localStorage.getItem('token'));
  
      // Перенаправлення на профіль
      navigate('/profile'); 
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setFormData({ username: '', password: '' }); // Очищення полів при помилці
      if (error.response?.status === 400) {
        setError('Невірний логін або пароль');
      } else {
        setError('Сталася помилка при вході');
      }
    }
  };

  return (
    <div className="container">
      <div className="register">
        <h1>Вхід</h1>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label>Логін:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <label>Пароль:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="regBtnContainer">
            <button type="submit">Увійти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
