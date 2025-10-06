const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String , 
        requires : true , 
        unique : true , 
        lowerCase : true , 
    },
    email : {
        type : String , 
        require : true , 
        unique : true , 
        lowerCase : true 
    },
    password : {
        type : String , 
        require : [true , "Password must needed"] 

    }

},
{ timestamps : true }
)


const User = mongoose.model("User" ,userSchema )


module.exports =  User