import mongoose  from "mongoose";
const noteSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        required:true,
        default:[]
    },
    isPinned:{
        type:Boolean,
        default:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now
    }
})
export default mongoose.model('Note',noteSchema);