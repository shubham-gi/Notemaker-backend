import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const authenticationToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if(token==null){
        return res.status(401).json({error:true,message:'Token not found'});
    }   
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            console.log(err.message);
            return res.sendStatus(403);
        }
        req.user=user;
        next();
    })
}
export const generateAccessToken=(user)=>{
    if(!process.env.ACCESS_TOKEN_SECRET){
        throw new Error('Access Token Secret is missing');
    }

    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'600m'});
}
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };