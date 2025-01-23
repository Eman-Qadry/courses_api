const mongoose=require('mongoose');
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    thumbnailUrl: { type: String },
    isActive: { type: Boolean, default: true },
    favourite:{type: Boolean, default: false},
    totalHours: { type: Object, default: {} },
    description:{type: String},
    isRecommended: { type: Boolean, default: false },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'playlist' },
    lastChecked: { type: Date, default: Date.now }, 
  isValid: { type: Boolean, default: true }
});
 module.exports=mongoose.model('Video',videoSchema);