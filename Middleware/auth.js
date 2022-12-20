import jwt from "jsonwebtoken"
import User from "../Model/User"
export const protect = async (req,res,next) =>{
    try{
        const autHeader = req.headers['authorization']
        const token = autHeader && autHeader.split(" ")[1]
        
        if(!token) return res.status(401).send({status:"failed",message:"no auth key"})
        const verifiedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!verifiedToken) return res.status(401).send({status:"failed",message:"unauthorized key"})
        const user = await User.findOne({email:verifiedToken})
        req.user = user._id
        next();
    }catch(err){
        console.log(err)
        return res.status(401).send({status:"failed",message:"no auth key"})
    }
}