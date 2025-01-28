const JWT=require('jsonwebtoken');
var decodedToken;
const isAuth=(req,res,next)=>{
    const Authheader= req.get('Authorization');
    if (!Authheader){
      res.status(401).json({message:"un aurhorized user"})
    }
    const token =Authheader.split(' ')[1];
    try {
        decodedToken = JWT.verify(token, process.env.JWT_SECRET);
      
      
      } catch (error) {
       res.status(401).json({message:"un aurhorized user"})
      }
      if (!decodedToken) {
        res.status(401).json({message:"un aurhorized user"})
    }
    req.adminId = decodedToken._id;
    next();
}
module.exports=isAuth;