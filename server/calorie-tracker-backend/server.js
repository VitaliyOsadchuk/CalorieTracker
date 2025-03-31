require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User"); // Ваша модель користувача
const jwt = require('jsonwebtoken');




// Створення Express додатку
const app = express();
app.use(express.json());
app.use(cors()); // для дозволу запитів з фронтенду
const port = process.env.PORT || 8080;
// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB підключено"))
.catch((err) => console.error("Помилка підключення до MongoDB:", err));

// Middleware для перевірки JWT токена
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Зберігаємо користувача в запиті для подальшої роботи
        next();
    });
};

    // app.use(cors(
    //     {

    //     }
    // ));

app.get("/", (req,res) => {
    res.json("Hello!");
});


// Реєстрація користувача
app.post("/api/auth/register", async (req, res) => {
    const { username, password, sex, age, weight, height, activityLevel,plan } = req.body;

    try {
        // Перевірка наявності користувача
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Користувач вже існує" });
        }

        // Створення нового користувача
        const newUser = new User({
            username,
            password, // пароль буде хешовано автоматично
            sex,
            age,
            weight,
            height,
            activityLevel,
            plan
        });

        await newUser.save();

        // Генерація JWT токена
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: "Користувач успішно зареєстрований",
            token,  // Додаємо токен до відповіді
        });
    } catch (error) {
        console.error("Помилка при реєстрації користувача", error);
        res.status(500).json({ message: "Сталася помилка при реєстрації" });
    }
});
// Авторизація користувача
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Невірний логін або пароль" });
        }

        // Порівняння пароля
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Невірний логін або пароль" });
        }

        // Генерація JWT токена
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token }); // Токен передається в відповідь
    } catch (error) {
        console.error("Помилка при вході", error);
        res.status(500).json({ message: "Сталася помилка при вході" });
    }
});

// Захищений маршрут (наприклад, профіль користувача)
app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // Беремо дані користувача з токену
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }
        res.json({ username: user.username,password: user.password, sex: user.sex, age: user.age, weight: user.weight, height: user.height, activityLevel: user.activityLevel,plan:user.plan });
    } catch (error) {
        console.error("Помилка при отриманні профілю", error);
        res.status(500).json({ message: "Сталася помилка при отриманні профілю" });
    }
});

app.put("/api/redact", authenticateToken, async (req, res) => {
    try {
        const { password, sex, age, weight, height, activityLevel, plan } = req.body;

        // Знаходимо користувача за ID
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }

        // Оновлюємо дані користувача
        user.password = password || user.password;
        user.sex = sex || user.sex;
        user.age = age || user.age;
        user.weight = weight || user.weight;
        user.height = height || user.height;
        user.activityLevel = activityLevel || user.activityLevel;
        user.plan = plan || user.plan;

        await user.save();
        res.json({ message: "Профіль успішно оновлено" });
    } catch (error) {
        console.error("Помилка при оновленні профілю", error);
        res.status(500).json({ message: "Сталася помилка при оновленні профілю" });
    }
});

//--------------------------------------------------------------------------------
// Отримання всіх записів калорій для користувача
app.get("/api/calories", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }
        res.status(200).json(user.caloriesRecords || []);
    } catch (error) {
        console.error("Помилка при отриманні записів", error);
        res.status(500).json({ message: "Сталася помилка при отриманні записів" });
    }
});

// Додавання запису калорій
app.post("/api/calories", authenticateToken, async (req, res) => {
    const { foodName, calories, time } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }

        // Перевірка на правильність формату часу в 24-годинному форматі (HH:mm)
        const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
        if (!isValidTime) {
            return res.status(400).json({ message: "Невірний формат часу. Використовуйте формат HH:mm" });
        }

        const newRecord = {
            foodName,
            calories,
            time,
        };

        user.caloriesRecords.push(newRecord);
        await user.save();

        res.status(201).json(newRecord);
    } catch (error) {
        console.error("Помилка при додаванні запису", error);
        res.status(500).json({ message: "Сталася помилка при додаванні запису" });
    }
});


// Видалення вибіркового запису
app.delete("/api/calories/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }

        if (!user.caloriesRecords.some(record => record._id.toString() === id)) {
            return res.status(404).json({ message: "Запис не знайдено" });
        }

        user.caloriesRecords = user.caloriesRecords.filter(record => record._id.toString() !== id);
        await user.save();

        res.status(200).json({ message: "Запис видалено" });
    } catch (error) {
        console.error("Помилка при видаленні запису", error);
        res.status(500).json({ message: "Сталася помилка при видаленні запису" });
    }
});

// Видалення всіх записів
app.delete("/api/calories", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }

        user.caloriesRecords = [];
        await user.save();

        res.status(200).json({ message: "Всі записи видалено" });
    } catch (error) {
        console.error("Помилка при видаленні всіх записів", error);
        res.status(500).json({ message: "Сталася помилка при видаленні всіх записів" });
    }
});

  
// Запуск сервера
const server = app.listen(port, () => console.log(`Сервер працює на порту ${port}`));
module.exports = app;
