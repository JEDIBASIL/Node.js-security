import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
})