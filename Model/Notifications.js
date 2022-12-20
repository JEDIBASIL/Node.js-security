import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    subject:{
        type:String,
        required:[true, "add notification subject"],
    },
    message:{
        type:String,
        required:[true, "add notification message"],
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isRead:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable:false,
    }, 
})

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;