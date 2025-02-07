const mongoose=require('mongoose');
const video = require('./video');
const TotalHoursSchema = require('./totalHour'); 
const topicSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
numberOfVideos: { type: Number, default: 0 },
actualNumberOfVideos: { type: Number, default: 0 },
actualHours:{ type: TotalHoursSchema, default: () => ({}) },
totalHours: { type: TotalHoursSchema, default: () => ({}) }
,  
video:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'Video'
}],
playlist:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'playlist'
}]
});

module.exports=mongoose.model('Topic',topicSchema);