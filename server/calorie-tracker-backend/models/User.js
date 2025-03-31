const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Для хешування паролів

// Опис схеми для записів калорій
const calorieRecordSchema = new mongoose.Schema({
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    time: { type: String, required: true },
});

// Опис схеми користувача
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sex: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    plan: { type: String, required: true },
    caloriesRecords: { type: [calorieRecordSchema], default: [] } // Додали поле записів калорій
});

// Хешування пароля перед збереженням
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Якщо пароль не змінюється, пропускаємо хешування
    this.password = await bcrypt.hash(this.password, 10); // Хешуємо пароль
    next();
});

// Метод для порівняння паролів під час авторизації
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Порівнюємо введений пароль з хешованим
};

module.exports = mongoose.model('User', userSchema);
