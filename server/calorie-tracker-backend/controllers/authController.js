const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Реєстрація нового користувача
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, sex, age, weight, height, activityLevel,plan } = req.body;

  try {
    // чи існує користувач із таким логіном
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Користувач уже існує' });
    }

    // Хешуємо пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Створюємо нового користувача
    user = new User({
      username,
      password: hashedPassword,
      sex,
      age,
      weight,
      height,
      activityLevel,
      plan,
    });

    await user.save();

    // JWT токен
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Щось пішло не так');
  }
};

// Вхід 
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Користувач не знайдений' });
    }

    // Перевіряємо пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Невірний пароль' });
    }

    // JWT токен
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Щось пішло не так');
  }
};
