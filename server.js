const express = require('express');
const bodyparser=require('body-parser');
const connectDB=require('./config/database')
const dotenv = require('dotenv');
const authRouter=require('./routes/admin/authRuter');
const vidrouter=require('./routes/admin/vidRouter');
const playListRoute=require('./routes/admin/playListRoute');
const topicRouter=require('./routes/admin/topicRouter');
const userRoute=require('./routes/User/topicRout');
const sendMessag=require('./routes/User/sendMessage');
const messageRoute=require('./routes/admin/messageRoute');
const{ checkPlaylists}=require('./services/validateLists')

const cors = require('cors');

dotenv.config();
const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  });
  
app.use('/api/v1/admin/auth',authRouter);
app.use('/api/v1/admin/topics',topicRouter);
app.use('/api/v1/admin/videos',vidrouter);
app.use('/api/v1/admin/playLists',playListRoute);
app.use('/api/v1/admin/messages',messageRoute);
app.use('/api/v1/user',sendMessag)
app.use('/api/v1/user/topics',userRoute)


app.get('/api/v1/',(req,res,next)=>{
    res.status(200).json("welcome to the server")
})
app.listen('5000',()=>{
    connectDB();
    console.log("server is started");
     scheduleCheckPlaylists();
    
})
 function scheduleCheckPlaylists() {
  //  checkPlaylists();
  // setInterval(scheduleCheckPlaylists, 172800000); // Schedule the next run after 2 days
}