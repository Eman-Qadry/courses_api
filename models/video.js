const mongoose=require('mongoose');
const videoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    totalHours: { type: Number, default: 0 },
    isRecommended: { type: Boolean, default: false },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
});
 module.exports=mongoose.model('Video',videoSchema);