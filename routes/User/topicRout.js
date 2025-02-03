const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/User/topicController');
const messgageController= require('../../controllers/User/sendMessag')
router.get('/',topicController.getAllTopics);
router.get('/:id',topicController.getTopicById);
router.get('/:id/playlists/:listID',topicController.getPlaylistById);
router.get('/:id/video/:videoID',topicController.getvideoById);
router.post('/sendMessage',messgageController.sendMessages);
module.exports=router;