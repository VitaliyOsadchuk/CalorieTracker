import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './calculator.css';


const CalorieCalculator = () => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [time, setTime] = useState('');
  const [caloriesRecords, setCaloriesRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Функція для отримання записів калорій з БД
  const fetchCaloriesRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Не вдалося отримати токен. Будь ласка, увійдіть ще раз.');
        return;
      }

      const response = await axios.get('https://calorietracker-7x32.onrender.com/api/calories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCaloriesRecords(response.data);
    } catch (error) {
      setErrorMessage('Не вдалося завантажити записи калорій.');
    }
  };

  // Функція для додавання нового запису калорій
  const handleAddRecord = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!foodName || !calories || !time) {
        setErrorMessage('Будь ласка, заповніть всі поля.');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Не вдалося отримати токен. Будь ласка, увійдіть ще раз.');
            return;
        }

        // Тут час уже в форматі HH:mm, так що можна передавати його без змін
        const response = await axios.post(
            'https://calorietracker-7x32.onrender.com/api/calories',
            { foodName, calories, time },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        setCaloriesRecords((prevRecords) => [...prevRecords, response.data]);
        setFoodName('');
        setCalories('');
        setTime('');
    } catch (error) {
        setErrorMessage('Не вдалося додати запис калорій.');
    }
};

  // Функція для видалення вибіркового запису
  const handleDeleteRecord = async (recordId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Не вдалося отримати токен. Будь ласка, увійдіть ще раз.');
        return;
      }

      await axios.delete(`https://calorietracker-7x32.onrender.com/api/calories/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCaloriesRecords((prevRecords) => prevRecords.filter((record) => record._id !== recordId));
    } catch (error) {
      setErrorMessage('Не вдалося видалити запис.');
    }
  };

  // Функція для видалення всіх записів калорій
  const handleDeleteAllRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Не вдалося отримати токен. Будь ласка, увійдіть ще раз.');
        return;
      }

      await axios.delete('https://calorietracker-7x32.onrender.com/api/calories', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCaloriesRecords([]);
    } catch (error) {
      setErrorMessage('Не вдалося видалити всі записи.');
    }
  };

  useEffect(() => {
    fetchCaloriesRecords();
  }, []);

  return (
    <div className="container">
      <div className="calorie-calculator">
        <div className='top'>
          <div className='hButton'><button onClick={() => navigate('/profile')}>Назад</button>
          <h1>Новий запис</h1></div>
            <form onSubmit={handleAddRecord}>
              <div className="row">
                <label>Назва їжі:</label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Назва їжі"
                />
              </div>

              <div className="row">
                <label>Калорії:</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Калорії"
                />
              </div>

              <div className="row">
                <label>Час:</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              {errorMessage && <label className="err">{errorMessage}</label>}

              <div className='centerButton'><button className='buttonAdd' type="submit">Додати запис</button></div>
            </form>
          
        </div>
        <div className='bottom'> 
        <h1>Історія</h1><ul>
          {caloriesRecords.length === 0 ? (
            <li className='err'>Записів немає</li>
          ) : (
            caloriesRecords.map((record) => (
              <li key={record._id}>
                <span>{record.foodName} - {record.calories} калорій - {record.time}</span>
                <button className='deleteR' onClick={() => handleDeleteRecord(record._id)}>ⓧ</button>
              </li>
            ))
          )}
        </ul>
        <div className='centerButton'><button className='deleteAll' onClick={handleDeleteAllRecords}>Видалити всі записи</button></div></div>
      </div>
    </div>
  );
};

export default CalorieCalculator;

