const mongoose=require('mongoose');
const connectDB=async ()=>{
    try{
        mongoose.connect('mongodb://localhost:27017/coursesAPI',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
         
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      }
}
module.exports=connectDB;