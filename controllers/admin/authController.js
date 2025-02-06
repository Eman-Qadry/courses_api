const Admin=require('../../models/admin');
const createJWT=require('../../config/JWT');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const sendgridtransport=require('nodemailer-sendgrid-transport');
let transporter;

// admin loggin
exports.postlogin=async (req,res,next)=>{
  try{
    const email=req.body.email;
    const password=req.body.password;
  const admin=  await Admin.findOne({email:email});
  if (!admin){
   return  res
     .status(404)
     .json({
      message: "Admin not found. Please check the email or sign up.",
    data:{}}
    );
  }
  
  const isEqualPassword= await admin.correctpasssword(password,admin.password);
  
  if (isEqualPassword){
    // create json web token
   const token= createJWT(admin._id);
  return  res
    .status(200)
    .json({ message: "Admin logged in successfully."
      , data:{token:token, adminId:admin._id}});
   
}
else {
  return res.status(401).json({
    message: "Incorrect password. Please try again.",
    data: {},
  });
}
}

catch (error) {

return res.status(500).json({
  message: "An error occurred while logging in. Please try again.",
  data: { error: error.message },
});
}
}


 exports.postsignup=async(req,res,next)=>{

 const email=req.body.email;
 const password=req.body.password;
 
  const admin= await Admin.findOne({email:email});
  if (admin){
    return  res.status(500).json("admin already signed up try to logg in");
  }
  
  const hashedpassword= await bcrypt.hash(password,12);

 
      const newAdmin=new Admin({
          
          email:email,
          password:hashedpassword,
         
         });
         await newAdmin.save();
    
    return  res.status(200).json("admin created successfully");
        }
 
    //forgot password using email verification
  exports.forgotPassword = async (req, res, next) => {
  
transporter=nodemailer.createTransport(sendgridtransport({
  auth:{
    api_key: process.env.SENDGRID_API_KEY
  }
}));
          try {
            const { email } = req.body;
        
            // Check if the admin exists
            const admin = await Admin.findOne({ email });
            if (!admin) {
              return res.status(404).json({
                message: "Admin not found. Please check the email address.",
                data: {},
              });
            }
        
            // Generate a token
            const resetToken = crypto.randomBytes(32).toString("hex");
        
            // Hash the token and set expiry
            const hashedToken = await bcrypt.hash(resetToken, 12);
            admin. passwordResetToken = hashedToken;
            admin.resetTokenExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes
        
            await admin.save();
        
          
            const resetLink = `${process.env.FRONTEND_URL}/resetpass.html?token=${resetToken}`;
            const mailOptions = {
              to: email,
              from: process.env.EMAIL_USER,
              subject: 'Reset Your Password',
              html: `
                <p>Hi,</p>
                <p>You requested to reset your password. Click the link below to proceed:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
                <p>The link will expire in 10 minutes.</p>
              `,
            };
        
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
               
                return res.status(500).json({ message: "Failed to send email", error: error.message });
              }
             
              return res.status(200).json({ message: "Email sent successfully!" });
            });
          } catch (error) {
        
            return res.status(500).json({
              message: "An error occurred while sending the reset token. Please try again.",
              data: { error: error.message },
            });
          }
        };

    

exports.resetPasswordWithToken = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Find admin by reset token
    const admin = await Admin.findOne({
      passwordResetToken: { $exists: true },
      resetTokenExpiration: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!admin) {
      return res.status(400).json({
        message: 'Invalid or expired reset token.',
        data: {},
      });
    }

    // Verify the token
    const isTokenValid = await bcrypt.compare(token, admin.passwordResetToken);
    if (!isTokenValid) {
      return res.status(400).json({
        message: 'Invalid reset token.',
        data: {},
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the admin's password
    admin.password = hashedPassword;

    // Clear the reset token fields
    admin.passwordResetToken = undefined;
    admin.resetTokenExpiration = undefined;

    await admin.save();

    return res.status(200).json({
      message: 'Password has been reset successfully. You can now log in with your new password.',
      data: {},
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({
      message: 'An error occurred while resetting the password. Please try again.',
      data: { error: error.message },
    });
  }
};


//change password
exports.changepassword = async (req, res, next) => {
  try {
    const { password, newpassword, confirmNewPass } = req.body;
    const adminId = req.adminId; 

    // Find the admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found. Please try again.',
        data: {},
      });
    }

    // Verify current password
    const isEqualPassword = await admin.correctpasssword(password, admin.password);
    if (!isEqualPassword) {
      return res.status(400).json({
        message: 'Your current password is incorrect.',
        data: {},
      });
    }

    // Check if new password matches confirmation
    if (newpassword !== confirmNewPass) {
      return res.status(400).json({
        message: 'New password and confirm password do not match.',
        data: {},
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newpassword, 12);

    // Update and save the admin's new password
    admin.password = hashedNewPassword;
    await admin.save();

    return res.status(200).json({
      message: 'Password updated successfully.',
      data: {},
    });
  } catch (error) {
    console.error('Error in changepassword:', error);
    return res.status(500).json({
      message: 'An error occurred while changing the password. Please try again.',
      data: { error: error.message },
    });
  }
};



exports.postsignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
        data: {},
      });
    }

   

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        message: 'Admin already exists. Please log in instead.',
        data: {},
      });
    }

    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });
    await newAdmin.save();

    return res.status(201).json({
      message: 'Admin account created successfully.',
      data: { adminId: newAdmin._id },
    });
  } catch (error) {
    console.error('Error in postsignup:', error);
    return res.status(500).json({
      message: 'An error occurred during signup. Please try again.',
      data: { error: error.message },
    });
  }
};
