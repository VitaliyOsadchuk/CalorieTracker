const express = require("express");
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware"); 

const router = express.Router();

// Додавання їжі до списку
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, calories } = req.body;

    if (!name || !calories) {
      return res.status(400).json({ message: "Назва їжі та калорійність є обов'язковими" });
    }

    const food = new Food({
      name,
      calories,
      user: req.user.id,
    });

    await food.save();
    res.status(201).json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

// Отримання історії їжі користувача
router.get("/", authMiddleware, async (req, res) => {
  try {
    const foods = await Food.find({ user: req.user.id }).sort({ time: -1 });
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

// Видалення їжі з історії
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Їжа не знайдена" });
    }

    if (food.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Немає доступу до видалення цієї їжі" });
    }

    await food.remove();
    res.json({ message: "Їжа видалена" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

module.exports = router;
