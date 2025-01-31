const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/User/topicController');
router.get('/',topicController.getAllTopics);
router.get('/:id',topicController.getTopicById);
router.get('/:id/playlists/:listID',topicController.getPlaylistById);
module.exports=router;