const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user:{
        type:String,
        required: [ true, "username is required for creating a like" ]
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: [ true, "post id is required for creating a like" ]
    }
}, {timeStamps: true})

likeSchema.index({user:1,post:1},{unique:true})

const likeModel = mongoose.model("likes", likeSchema);

module.exports = likeModel