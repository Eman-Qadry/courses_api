const nodemailer = require("nodemailer");

exports.sendMessages = async (req, res) => {
  const { fullName, email, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const senderEmail = process.env.EMAIL_USER;
  const senderPassword = process.env.EMAIL_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  const mailOptions = {
    from: senderEmail,
    to: adminEmail,
    subject: `New Contact Request from ${fullName}`,
    html: `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Error sending email", error: error.message });
  }
};
