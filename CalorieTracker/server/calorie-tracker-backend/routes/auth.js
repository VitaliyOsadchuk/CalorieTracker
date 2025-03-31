const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// Реєстрація
router.post(
  '/register',
  [
    check('username', 'Логін є обов\'язковим').not().isEmpty(),
    check('password', 'Пароль має бути довжиною не менше 6 символів').isLength({ min: 6 }),
    check('sex', 'Стать є обов\'язковою').not().isEmpty(),
    check('age', 'Вік є обов\'язковим').isInt(),
    check('weight', 'Вага є обов\'язковою').isFloat(),
    check('height', 'Ріст є обов\'язковим').isInt(),
    check('activityLevel', 'Рівень активності є обов\'язковим').not().isEmpty(),
  ],
  authController.register
);

// Вхід
router.post('/login', authController.login);

module.exports = router;
