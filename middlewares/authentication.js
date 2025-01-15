const JWT=require('jsonwebtoken');
var decodedToken;
const isAuth=(req,res,next)=>{
    const Authheader= req.get('Authorization');
    if (!Authheader){
        const err= new Error('beaer token error');
        err.statusCode=401;
        next(err);
    }
    const token =Authheader.split(' ')[1];
    try {
        decodedToken = JWT.verify(token, process.env.JWT_SECRET);
      
      
      } catch (error) {
        next(error);
      }
      if (!decodedToken) {
        const err= new Error('Not Authorized ');
        err.statusCode=401;
        next(err);
    }
    req.adminId = decodedToken._id;
    next();
}
module.exports=isAuth;