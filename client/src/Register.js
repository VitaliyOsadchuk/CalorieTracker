import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    sex: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    plan: 'weight_maintenance',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username' && value.length > 20) {
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.username.length > 20) {
      setErrorMessage('Логін не може перевищувати 20 символів');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Пароль повинен бути не менше 6 символів');
      return;
    }

    try {
      const response = await axios.post('https://calorietracker-7x32.onrender.com/api/auth/register', formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      navigate('/profile');
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage('Цей логін вже зайнятий. Будь ласка, виберіть інший.');
      } else {
        setErrorMessage('Сталася помилка при реєстрації');
      }
    }
  };

  return (
    <div className="container">
      <div className="register">
        <h1>Реєстрація</h1>
        <form onSubmit={handleSubmit}>
          {[ 
            { label: 'Логін', name: 'username', type: 'text' },
            { label: 'Пароль', name: 'password', type: 'password' },
            { label: 'Вік', name: 'age', type: 'number' },
            { label: 'Вага (кг)', name: 'weight', type: 'number' },
            { label: 'Зріст (см)', name: 'height', type: 'number' },
          ].map(({ label, name, type }) => (
            <div className="row" key={name}>
              <label>{label}:</label>
              <input 
                type={type} 
                name={name} 
                value={formData[name]} 
                onChange={handleChange} 
                required 
              />
            </div>
          ))}

          <div className="row">
            <label>Стать:</label>
            <select name="sex" value={formData.sex} onChange={handleChange} required>
              <option value="">Оберіть стать</option>
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
            </select>
          </div>

          <div className="row">
            <label>Активність:</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
              <option value="">Оберіть активність</option>
              <option value="sedentary">Малорухливий</option>
              <option value="light">Легка активність</option>
              <option value="moderate">Середня активність</option>
              <option value="high">Висока активність</option>
              <option value="very_high">Дуже висока активність</option>
            </select>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <div className="regBtnContainer">
            <button className="registerButton" type="submit">Реєстрація</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;