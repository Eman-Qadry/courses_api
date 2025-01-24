const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const adminSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true

    },
    passwordResetToken:{  type: String},
    tokenExpiration:{ type:Date},
      createdAt: { type: Date, default: Date.now() }
});

adminSchema.methods.correctpasssword = async function (enteredpassword, adminpassword) {
  const res= await bcrypt.compare(enteredpassword, adminpassword);
  console.log(res);
  return res;
};

   
   adminSchema.methods.createResetToken= function(){
   
     const resetToken = crypto.randomBytes(12).toString('hex');
     this.passwordResetToken=resetToken ;
     this.tokenExpiration=Date.now()+ process.env.RESET_TOKEN_EXPIRESION;
    
   return resetToken;
   };
   
  
module.exports=mongoose.model('Admin',adminSchema);