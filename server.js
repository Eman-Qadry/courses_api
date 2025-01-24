const express = require('express');
const bodyparser=require('body-parser');
const connectDB=require('./config/database')
const dotenv = require('dotenv');
const authRouter=require('./routes/admin/authRuter');
const vidrouter=require('./routes/admin/vidRouter');
const playListRoute=require('./routes/admin/playListRoute');
const topicRouter=require('./routes/admin/topicRouter');
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
  
app.use('/admin/auth',authRouter);
app.use('/admin/topics',topicRouter);
app.use('/admin/videos',vidrouter);
app.use('/admin/playLists',playListRoute);
app.get('/',(req,res,next)=>{
    res.status(200).json("welcome to the server")
})
app.listen('5000',()=>{
    connectDB();
    console.log("server is started");
})