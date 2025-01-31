const Topic = require('../../models/topic');

exports.createTopic = async (req, res) => {
  const name = req.body.name;
  
  // Validate input
  if (!name || typeof name !== 'string' || name.trim() === "") {
    return res.status(400).json({
      message: "Topic name must be a non-empty string.",
      data: {}
    });
  }

  try {
    const existedTopic = await Topic.findOne({ name: name });
    if (existedTopic) {
      return res.status(400).json({
        message: "Topic already exists.",
        data: {}
      });
    }

    const topic = new Topic({ name });
    const saved = await topic.save();
    
    if (!saved) {
      return res.status(500).json({
        message: "Topic not created.",
        data: {}
      });
    }

    return res.status(200).json({
      message: "Topic created successfully.",
      data: { topic: saved }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating the topic.",
      data: { error: error.message }
    });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().select(" _id name numberOfVideos totalHours");;
    if (!topics || topics.length === 0) {
      return res.status(400).json({
        message: 'There are no topics yet, try creating one.',
        data: {}
      });
    }

    return res.status(200).json({
      message: 'These are the topics.',
      topics: topics
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error occurred while fetching topics.',
      data: { error: error.message }
    });
  }
};

exports.renameTopic = async (req, res) => {
  const { newname, topicId } = req.body;

  // Validate input
  if (!newname || typeof newname !== 'string' || newname.trim() === "") {
    return res.status(400).json({
      message: "New topic name must be a non-empty string.",
      data: {}
    });
  }

  if (!topicId || typeof topicId !== 'string') {
    return res.status(400).json({
      message: "Topic ID must be a valid string.",
      data: {}
    });
  }

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(400).json({
        message: 'Topic does not exist.',
        data: {}
      });
    }

    topic.name = newname;
    const savedTopic = await topic.save();
    
    if (!savedTopic) {
      return res.status(500).json({
        message: 'Error occurred while renaming the topic.',
        data: {}
      });
    }

    return res.status(200).json({
      message: 'Topic renamed successfully.',
      data: {savedTopic}
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error occurred while renaming the topic.',
      data: { error: error.message }
    });
  }
};

exports.deleteTopic = async (req, res) => {
  const { topicId } = req.query;

  // Validate input
  if (!topicId || typeof topicId !== 'string') {
    return res.status(400).json({
      message: "Topic ID must be a valid string.",
      data: {}
    });
  }

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(400).json({
        message: 'Topic does not exist.',
        data: {}
      });
    }

    const deleted = await Topic.deleteOne({ _id: topicId });
    
    if (!deleted) {
      return res.status(500).json({
        message: 'Error occurred while deleting the topic.',
        data: {}
      });
    }

    return res.status(200).json({
      message: 'Topic deleted successfully.',
      data: {}
    });
  } catch (error) {
   
    return res.status(500).json({
      message: 'Error occurred while deleting the topic.',
      data: { error: error.message }
    });
  }
};


// عايزة اعدل التوبيك انه يشوف مجموع الفديوهات والساعات عند الادمن 