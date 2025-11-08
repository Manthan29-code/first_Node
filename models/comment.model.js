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
        type: mongoose.Schema.Type.ObjectId,
        ref: "User"
    }
} ,
{
    timestamp : true
})

commentSchema.plugin(mongooseAggregatePaginate)


const comment = mongoose.model( "Comment" , commentSchema)

module.exports = {comment}