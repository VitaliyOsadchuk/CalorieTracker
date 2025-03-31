// src/api.js
import axios from "axios";

const API_URL = "https://calorietracker-7x32.onrender.com/api"; // Задайте правильний URL для вашого API

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Error registering", error);
    throw error;
  }
};

export const getCaloriesRecords = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/calories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching calories records", error);
    throw error;
  }
};

// Додавання нового запису
export const addCaloriesRecord = async (token, foodName, calories, time) => {
  try {
    const response = await axios.post(`${API_URL}/calories`, {
      foodName,
      calories,
      time
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding calories record", error);
    throw error;
  }
};

// Видалення вибіркового запису
export const deleteCaloriesRecord = async (token, recordId) => {
  try {
    const response = await axios.delete(`${API_URL}/calories/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting calories record", error);
    throw error;
  }
};

// Видалення всіх записів
export const deleteAllCaloriesRecords = async (token) => {
  try {
    const response = await axios.delete(`${API_URL}/calories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting all calories records", error);
    throw error;
  }
};