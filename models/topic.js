const mongoose=require('mongoose');
const video = require('./video');
const topicSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
numberOfVideos: { type: Number, default: 0 },
totalHours: { type: Number, default: 0 },
video:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'Video'
}],
playlist:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'playlist'
}]
});

module.exports=mongoose.model('Topic',topicSchema);