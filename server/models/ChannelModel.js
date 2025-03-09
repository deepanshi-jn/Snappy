import mongoose from "mongoose";

const channelScehma=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    members:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Users",
            required:true,
        }
    ],
    admin:{
        type:mongoose.Schema.ObjectId,
        ref:"Users",
        required:true,
    },
    messages:[{
        type:mongoose.Schema.ObjectId,
        ref:"Messages",
        required:false,
    }],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    updatedAt:{
        type:Date,
        default:Date.now(),
    },
})

channelScehma.pre("save",function(next){
    this.updatedAt=Date.now()
    next()
})

channelScehma.pre("findOneAndUpdate",function(next){
    this.set({ updatedAt: Date.now() })
    next()
})

const Channel=mongoose.model("Channels",channelScehma)
export default Channel
