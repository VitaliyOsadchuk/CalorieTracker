import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './redact.css';
import './profile.css';

const EditUserProfile = () => {
  const [userData, setUserData] = useState({
    age: '',
    weight: '',
    height: '',
    sex: '',
    activityLevel: '',
    plan: '',
    newPassword: '',     
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Завантаження даних користувача з БД
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Обробка оновлення стану
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Збереження змін
  const handleSaveChanges = async () => {
    const { newPassword } = userData;

    // Перевірка, чи введено новий пароль і чи він має довжину більше 6 символів
    if (!newPassword) {
      setError('Будь ласка, введіть новий пароль');
      return;
    }
    if (newPassword.length < 6) {
      setError('Пароль має бути довший за 6 символів');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Додаємо новий пароль, якщо він є
      const updatedUserData = {
        ...userData,
        password: newPassword, // використовуємо новий пароль
      };

      await axios.put(
        'http://localhost:5000/api/redact',
        { ...updatedUserData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Дані успішно оновлено!');
      navigate('/profile');
    } catch (error) {
      console.error('Помилка при оновленні даних:', error.response?.data || error.message);
      alert('Помилка при оновленні профілю');
    }
  };

  // Скасування змін
  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="containerU">      
        <h2>Редагування профілю</h2>
        <div className='redactCont'>
        <label><strong>Вік:</strong></label>
        <input
          type="number"
          name="age"
          value={userData.age}
          onChange={handleChange}
          required
        />
        </div>

        <div className='redactCont'>
        <label><strong>Вага (кг):</strong></label>
        <input
          type="number"
          name="weight"
          value={userData.weight}
          onChange={handleChange}
          required
        />

        </div>

        <div className='redactCont'>
        <label><strong>Зріст (см):</strong></label>
        <input
          type="number"
          name="height"
          value={userData.height}
          onChange={handleChange}
          required
        />
        </div>

        <div className='redactCont'>
        <label><strong>Стать:</strong></label>
        <select name="sex" value={userData.sex} onChange={handleChange}>
          <option value="male">Чоловіча</option>
          <option value="female">Жіноча</option>
        </select>
        </div>

        <div className='redactCont'>
        <label><strong>Активність:</strong></label>
        <select name="activityLevel" value={userData.activityLevel} onChange={handleChange}>
          <option value="sedentary">Малорухливий</option>
          <option value="light">Легка</option>
          <option value="moderate">Середня</option>
          <option value="high">Висока</option>
          <option value="very_high">Дуже висока</option>
        </select>
        </div>

        <div className='redactCont'>
        <label><strong>План:</strong></label>
        <select name="plan" value={userData.plan} onChange={handleChange}>
          <option value="weight_maintenance">Утримання ваги</option>
          <option value="weight_loss">Схуднення</option>
          <option value="rapid_weight_loss">Швидке схуднення</option>
        </select>
        </div>
  
        <div className='redactCont newPass'>
        <label><strong>Новий пароль:</strong></label>
          <input
            className='newPass'
            type="password"
            name="newPassword"
            value={userData.newPassword}
            onChange={handleChange}
            required
          />
          
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="uBtnContainer">
          <button onClick={handleCancel}>Скасувати</button>
          <button onClick={handleSaveChanges}>Зберегти зміни</button>
        </div>
        </div>
  );
};

export default EditUserProfile;
