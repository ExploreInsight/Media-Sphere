import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried:true
    },
    type:{
        type:String,
        requried:true,
        enum:["follow","like"]
    },
    read:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const Notification = mongoose.model("Notification",notificationSchema)

export default Notification;