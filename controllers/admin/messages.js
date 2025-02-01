
const Message=require('../../models/message');
exports.getMessages = async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 }); // Fetch messages sorted by latest first
      res.status(200).json({
      message:"messages are fetched successfully" ,
        data:{messages}
    }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching messages' });
    }
  };