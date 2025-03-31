const mongoose = require("mongoose");

const caloriesSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Calories = mongoose.model("Calories", caloriesSchema);

module.exports = Calories;
