const mongoose=require('mongoose');
const TotalHoursSchema = require('./totalHour'); 
const playlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    description:{type: String},
    thumbnailUrl: { type: String },
    numberOfVideos: { type: Number, default: 0 },
    totalHours: { type: TotalHoursSchema, default: () => ({}) },
    isRecommended: { type: Boolean, default: false },
    video:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Video'
    }],
    lastChecked: { type: Date, default: Date.now }, 
    isValid: { type: Boolean, default: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
});

 module.exports=mongoose.model('playlist',playlistSchema);