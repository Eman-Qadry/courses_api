const express=require('express');
const topicRouter=express.Router();
const authorized=require('../../middlewares/authentication');
const topicController=require('../../controllers/admin/topicController');
topicRouter.post('/',authorized,topicController.createTopic);
topicRouter.get('/',authorized,topicController.getTopics);
topicRouter.put('/',authorized,topicController.renameTopic);
topicRouter.delete('/',authorized,topicController.deleteTopic);

module.exports=topicRouter;