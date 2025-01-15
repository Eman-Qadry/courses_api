const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
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

adminSchema.methods.correctpasssword= async function (enteredpassword,adminpassword){
    return await bcrypt.compare(userpassword,enteredpassword);
   };
   
   adminSchema.methods.createResetToken= function(){
   
     const resetToken = crypto.randomBytes(12).toString('hex');
     this.passwordResetToken=resetToken ;
     this.tokenExpiration=Date.now()+ process.env.RESET_TOKEN_EXPIRESION;
    
   return resetToken;
   };
   
   adminSchema.pre('save',async function(next){
     if (!this.isModified('password'))
       return next();
     const salt= await bcrypt.genSalt(12);
      this.password= await bcrypt.hash(this.password,salt);
      next();
   });
module.exports=mongoose.model('Admin',adminSchema);