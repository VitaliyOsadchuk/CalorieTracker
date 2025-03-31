// src/components/Login.js
import React, { useState } from "react";
import { loginUser } from "../api";
import { registerUser } from "../api"; // Додамо нову функцію для реєстрації

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Для переключення між входом та реєстрацією
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      setToken(data.token); // Зберігаємо токен для подальших запитів
    } catch (error) {
      alert("Помилка при вході, перевірте дані");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(registerUsername, registerPassword);
      alert("Реєстрація успішна! Тепер ви можете увійти.");
      setIsRegistering(false); // Перемикаємо на форму для входу
    } catch (error) {
      alert("Помилка при реєстрації");
    }
  };

  return (
    <div>
      {isRegistering ? (
        <form onSubmit={handleRegister}>
          <h2>Реєстрація</h2>
          <input
            type="text"
            placeholder="Логін"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
          <button type="submit">Зареєструватися</button>
          <p>
            Уже є аккаунт?{" "}
            <span onClick={() => setIsRegistering(false)} style={{ color: "blue", cursor: "pointer" }}>
              Увійти
            </span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Вхід</h2>
          <input
            type="text"
            placeholder="Логін"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Вхід</button>
          <p>
            Немає аккаунту?{" "}
            <span onClick={() => setIsRegistering(true)} style={{ color: "blue", cursor: "pointer" }}>
              Зареєструватися
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
