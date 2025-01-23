const express=require('express');
const vidrouter=express.Router();
const authorized=require('../../middlewares/authentication');
const vidcontroller=require('../../controllers/admin/videoController');
vidrouter.post('/',authorized,vidcontroller.addvideo)

vidrouter.post('/iaAvailable',authorized,vidcontroller.checkVideoAvailability)
vidrouter.post('/activate',authorized,vidcontroller.activateVideo)
vidrouter.post('/deactivate',authorized,vidcontroller.deactivateVideo)
vidrouter.post('/recommended',authorized,vidcontroller.recommendVideo)
vidrouter.post('/favourite',authorized,vidcontroller.favouriteVideo)
vidrouter.post('/notRecommended',authorized,vidcontroller.notRecommendVideo)
vidrouter.delete('/',authorized,vidcontroller.deleteVideo);
module.exports=vidrouter;