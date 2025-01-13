const mongoose=require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    numberOfVideos: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    isRecommended: { type: Boolean, default: false },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
});

 module.exports=mongoose.model('playlist',playlistSchema);