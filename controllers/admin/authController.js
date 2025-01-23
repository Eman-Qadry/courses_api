const Admin=require('../../models/admin');
const createJWT=require('../../config/JWT');
const bcrypt=require('bcryptjs')
// admin loggin
exports.postlogin=async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
  const admin=  await Admin.findOne({email:email});
  if (!admin){
    res
     .status(404)
     .json('could not find admin with this email , you can try to sign up');
  }
  const isEqualPassword=admin.correctpasssword(password,admin.password);
  if (isEqualPassword){
    // create json web token
   const token= createJWT(admin._id);
    res
    .status(200)
    .json({message:'admin loged in successfully', data:{token:token, adminId:admin._id}});
}
else {
    res
    .status(200)
    .json('admin password is not correct');
}
}

// change password

exports.resetpassword=async (req,res,next)=>{
    const password=req.body.password;
    const newpassword=req.body.newpassword;
    const confirmNewPass=req.body.confirmNewPass;
    const adminId= req.adminId
   
    const admin= await Admin.findById(adminId);
    if (!admin){
        res
         .status(404)
         .json('could not find admin with this Id , you can try to again');
      }
      const isEqualPassword=admin.correctpasssword(password,admin.password);
      if (!isEqualPassword){
        const err=new Error ('admin password is not true');
        err.statusCode=500;
        next(err);
    }
    if (newpassword != confirmNewPass){
        const err=new Error ('confirm password not equal new password');
            err.statusCode=500;
            next(err);
    }
   
  
 admin.password=newpassword;
 await admin.save();
 res.status(200)
 .json({
     message: 'password is reset successfully.'
   });
 
 };

 exports.postsignup=async(req,res,next)=>{

 const email=req.body.email;
 const password=req.body.password;
 
  const admin= await Admin.findOne({email:email});
  
  
  const hashedpassword= await bcrypt.hash(password,12);

 
      const newAdmin=new Admin({
          
          email:email,
          password:hashedpassword,
         
         });
         await newAdmin.save();
    
     res.status(200).json("admin created successfully");
        }
 
 
