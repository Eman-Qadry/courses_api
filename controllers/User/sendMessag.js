 const Message=require('../../models/message');
 
 exports.sendMessages=async (req, res) => {
    const { fullName, email, message } = req.body;
  
    const newMessage = new Message({ fullName, email, message });
  
    try {
      await newMessage.save();
      res.status(200).json({
        message:'Message sent successfully'}
    );
    } catch (error) {
        console.log(error);
      res.status(500).json('Error sending message');
    }
  };