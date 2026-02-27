const { Schema, model } = require('mongoose');

const timerSchema = new Schema({
    userId: String,
    reason: { type: String, default: "Time is up!" },
    endTime: Date,
});

module.exports = model('Timer', timerSchema);
