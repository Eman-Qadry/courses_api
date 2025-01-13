const mongoose=require('mongoose');
const topicSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
numberOfVideos: { type: Number, default: 0 },
totalHours: { type: Number, default: 0 }
});

module.exports=mongoose.model('Topic',topicSchema);