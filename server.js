const express = require('express');
const bodyparser=require('body-parser');
const connectDB=require('./config/database')
const dotenv = require('dotenv');
const authRouter=require('./routes/admin/authRuter');
const vidrouter=require('./routes/admin/vidRouter');
const playListRoute=require('./routes/admin/playListRoute');
const topicRouter=require('./routes/admin/topicRouter');

dotenv.config();
const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/admin/auth',authRouter);
app.use('/admin/topics',topicRouter);
app.use('/admin/videos',vidrouter);
app.use('/admin/playLists',playListRoute);
app.listen('6000',()=>{
    connectDB();
    console.log("server is started");
})