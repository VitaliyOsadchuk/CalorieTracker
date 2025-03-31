// src/components/FoodList.js
import React, { useEffect, useState } from "react";
import { getFood, addFood, deleteFood } from "../api";

const FoodList = ({ token }) => {
  const [foodList, setFoodList] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await getFood(token);
        setFoodList(data);
      } catch (error) {
        console.error("Error fetching food", error);
      }
    };
    if (token) {
      fetchFood();
    }
  }, [token]);

  const handleAddFood = async () => {
    const foodData = {
      name: foodName,
      calories: parseInt(foodCalories),
    };
    try {
      await addFood(foodData, token);
      setFoodList([...foodList, foodData]);
      setFoodName("");
      setFoodCalories("");
    } catch (error) {
      console.error("Error adding food", error);
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      await deleteFood(id, token);
      setFoodList(foodList.filter((food) => food._id !== id));
    } catch (error) {
      console.error("Error deleting food", error);
    }
  };

  return (
    <div>
      <h2>Їжа</h2>
      <input
        type="text"
        placeholder="Назва їжі"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Калорії"
        value={foodCalories}
        onChange={(e) => setFoodCalories(e.target.value)}
      />
      <button onClick={handleAddFood}>Додати їжу</button>
      <ul>
        {foodList.map((food) => (
          <li key={food._id}>
            {food.name} - {food.calories} калорій
            <button onClick={() => handleDeleteFood(food._id)}>Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;
