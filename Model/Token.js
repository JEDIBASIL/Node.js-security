import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    key:{
        type:String,
        required: true
    },
    isUsed:{
        type:Boolean,
        default:false
    }
})

const Token = mongoose.model("token", tokenSchema)

export default Token;