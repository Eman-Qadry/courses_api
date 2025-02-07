const mongoose = require('mongoose');

const TotalHoursSchema = new mongoose.Schema({
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 }
});

module.exports = TotalHoursSchema; 
