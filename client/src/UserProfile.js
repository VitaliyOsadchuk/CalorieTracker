import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoutIcon from '../src/materials/logout.png'; 
import InfoIcon from '../src/materials/info.png'; 
import './profile.css';

const InfoModal = ({ onClose }) => {
  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>Формула розрахунку калорій</h2>
        <p><strong>Цільові калорії (TDEE):</strong></p>
        <p><code>TDEE = BMR × ActivityLevel</code></p>
        <p><strong>BMR (Базовий метаболізм):</strong> Розраховується за формулою Mifflin-St Jeor:</p>
        <p><code>BMR = 10 × вага (кг) + 6.25 × зріст (см) - 5 × вік (роки) + (5 для чоловіків / -161 для жінок)</code></p>
        
        <h2>Рівні активності</h2>
        <ul>
          <li><strong>Малорухливий (1.2):</strong> Мінімальна активність, сидячий спосіб життя.</li>
          <li><strong>Легка активність (1.375):</strong> Легкі тренування 1-3 рази на тиждень.</li>
          <li><strong>Середня активність (1.55):</strong> Помірні тренування 3-5 разів на тиждень.</li>
          <li><strong>Висока активність (1.725):</strong> Інтенсивні тренування 6-7 разів на тиждень.</li>
          <li><strong>Дуже висока активність (1.9):</strong> Фізично важка робота або професійний спорт.</li>
        </ul>
        <button onClick={onClose} className="close-btn">Закрити</button>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [caloriesRecords, setCaloriesRecords] = useState([]); // Масив калорій
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(null);
  const [loadingDots, setLoadingDots] = useState('');
  const navigate = useNavigate();

  // Отримуємо дані про калорії
  useEffect(() => {
    const fetchCalories = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Немає токена авторизації");
                return;
            }

            const response = await fetch("https://calorietracker-7x32.onrender.com/api/calories", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Помилка отримання калорій");
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Некоректний формат даних");
            }

            setCaloriesRecords(data); // Зберігаємо масив
            console.log("Записи калорій:", data); // Вивід у консоль

            // Правильний доступ до значення калорій та підсумок
            const totalCalories = data.reduce((sum, record) => sum + record.calories, 0); // Додаємо calories
            setCaloriesConsumed(totalCalories);
            console.log("Сума калорій:", totalCalories); // Вивід у консоль

        } catch (error) {
            console.error("Помилка:", error.message);
        }
    };

    fetchCalories();
}, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://calorietracker-7x32.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, [navigate]);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

   //-------------------------------------------------------------------------------
   useEffect(() => {
    if (userData) {
      const calculateCalories = () => {
        const { weight, height, age, sex, activityLevel, plan, calorieRecords } = userData;

        let BMR = 0;
        if (sex === 'male') {
          BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (sex === 'female') {
          BMR = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        let activityFactor = 1.2;
        if (activityLevel === 'sedentary') activityFactor = 1.2;
        else if (activityLevel === 'light') activityFactor = 1.375;
        else if (activityLevel === 'moderate') activityFactor = 1.55;
        else if (activityLevel === 'high') activityFactor = 1.725;
        else if (activityLevel === 'very_high') activityFactor = 1.9;

        let dailyCalories = BMR * activityFactor;

        if (plan === 'weight_loss') {
          dailyCalories *= 0.8; // Схуднення, 20% менше
        } else if (plan === 'rapid_weight_loss') {
          dailyCalories *= 0.6; // Швидке схуднення, 40% менше
        }

        setCaloriesGoal(Math.round(dailyCalories)); // Округлення значення

        // Підрахунок загальної суми всіх записів про калорії
        const totalCalories = calorieRecords && calorieRecords.length > 0 
          ? calorieRecords.reduce((sum, record) => sum + record.calories, 0) 
          : 0;

        console.log(`Загальна сума калорій користувача: ${totalCalories}`);
      };

      calculateCalories();
    }
  }, [userData]);


   //-------------------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  if (!userData) {
    return <div className='loading'><h3>Завантаження даних{loadingDots}</h3></div>;
  }

   //-------------------------------------------------------------------------------
  // Визначаємо колір тексту для калорій
  const getCaloriesTextColor = () => {
    if (caloriesConsumed === 0) {
      return 'yellow';
    } else if (caloriesConsumed > caloriesGoal) {
      return 'red';
    } else {
      return 'darkgreen';
    }
  };

  return (
    <div className="containerU">
      <div className="user-profile">
        <div className="btnHeader">
          <button className="logout-btn" onClick={handleLogout}> 
            <img src={logoutIcon} alt="Вийти" className="logout-icon" /> 
          </button>
          <h1>Кабінет користувача</h1>
          <button className="logout-btn info" onClick={() => setIsModalOpen(true)}> 
            <img src={InfoIcon} alt="Інфо" className="logout-icon" /> 
          </button>
        </div>
        {isModalOpen && <InfoModal onClose={() => setIsModalOpen(false)} />}
        <div className="profile-info">

        <div className='right'>
          <label className='calories'><strong>Калорії:</strong></label>
          <label className='calories'><span style={{ color: getCaloriesTextColor() }}>
          {caloriesConsumed}</span> / {Math.round(caloriesGoal)}</label>
          </div>

          <div className='left'>
          <label><strong>Логін:</strong> {userData.username}</label>
          <label><strong>Вік:</strong> {userData.age} років</label>
          <label><strong>Вага:</strong> {userData.weight} кг</label>
          <label><strong>Зріст:</strong> {userData.height} см</label>
          <label><strong>Стать:</strong> {userData.sex === 'male' ? 'Чоловіча' : 'Жіноча'}</label>
          <label><strong>Активність:</strong> {
            userData.activityLevel === "sedentary" ? "Малорухливий" :
            userData.activityLevel === "light" ? "Легка" :
            userData.activityLevel === "moderate" ? "Середня" :
            userData.activityLevel === "high" ? "Висока" :
            userData.activityLevel === "very_high" ? "Дуже висока" :
            "Невідомо"
          }</label>
          <label><strong>План:</strong> {userData.plan === 'weight_maintenance' ? 'Утримання ваги' :
            userData.plan === 'weight_loss' ? 'Схуднення' :
            userData.plan === 'rapid_weight_loss' ? 'Швидке схуднення' :
            'Невідомо'}</label>
          </div>
        
        
        </div>
        <div className="uBtnContainer">
          <button onClick={() => navigate('/redactProfile')}>Редагування</button>
          <button onClick={() => navigate('/calorieCalculator')}>Записи</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
