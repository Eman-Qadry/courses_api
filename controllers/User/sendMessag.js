 const Message=require('../../models/message');
 
 const sendgridtransport=require('nodemailer-sendgrid-transport');
let transporter;
  const nodemailer = require("nodemailer");

exports.sendMessages = async (req, res) => {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

  transporter=nodemailer.createTransport(sendgridtransport({
    auth:{
      api_key: process.env.SENDGRID_API_KEY
    }
  }));

  const mailOptions = {
    from: process.env.EMAIL_USER, // Use a verified sender email
    to: process.env.ADMIN_EMAIL, // Admin email
    replyTo: email, // User's email (so you can reply to them)
    subject: `Message from ${fullName}`,
    text: `From: ${email}\n\n${message}`
};


    try {
        transporter.sendMail(mailOptions,(error, info) => {
          if (error) {
           
            return res.status(500).json({ message: "Failed to send email", error: error.message });
          }
         
          return res.status(200).json({ message: "Email sent successfully!" });
        });
       
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
    }
};
