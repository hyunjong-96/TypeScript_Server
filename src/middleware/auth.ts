import jwt from "jsonwebtoken"
import config from "../config"

export default (req,res,next)=>{
    //Get token from header
    const token = req.header("x-auth-token")

    //Check if not token
    if(!token){
        return res.status(401).json({msg:"No Token, authorization denied"})
    }

    //Verify Token
    try{
        const decoded = jwt.verify(token, config.jwtSecret)

        req.body.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg:"Token is not valid"})
    }
}