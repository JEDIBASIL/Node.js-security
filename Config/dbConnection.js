import mongoose from "mongoose";

export const connectDB = async () =>{
    mongoose.connect(process.env.MONGO_URI);
    // mongoose.connect("mongodb+srv://jedi:gNiSNhudjyEZlWzk@cluster0.zjs6uhs.mongodb.net/?retryWrites=true&w=majority")
}