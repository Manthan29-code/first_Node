const mongoose = require('mongoose')
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const commentSchema = new mongoose.Schema({
    content : {
        type : String , 
        require : true 
    },
    video : {
        type : mongoose.Schema.Type.ObjectId ,
        ref : "Video"
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
} ,
{
    timestamps : true
})

commentSchema.plugin(mongooseAggregatePaginate)


const Comment = mongoose.model( "Comment" , commentSchema)

module.exports = {Comment}