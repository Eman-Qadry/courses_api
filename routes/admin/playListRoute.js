const express=require('express');
const listrouter=express.Router();
const authorized=require('../../middlewares/authentication');
const listcontroller=require('../../controllers/admin/playListController');
listrouter.post('/',authorized,listcontroller.addplaylists);

listrouter.post('/isAvailable',authorized,listcontroller.checkPlaylistAvailability);

module.exports=listrouter;