const mongoose = require("mongoose")

const subTodoSchema = new mongoose.Schema({
    content : {
        type : String , 
        require : true 
    },
    complete : {
        type : Boolean,
        default : true 
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    },
} ,
    { timestamps : true }
)

const SubTodo = mongoose.model( 'SubTodo' ,subTodoSchema )

module.exports = SubTodo