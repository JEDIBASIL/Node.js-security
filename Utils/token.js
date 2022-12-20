import jwt from "jsonwebtoken";

export const generateVerificationToken = async (email) =>{
    return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
}

export const verifyToken = async (token) =>{
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}