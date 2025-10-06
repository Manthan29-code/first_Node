const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    description : {
        require : true , 
        type : String 
    },
    name : {
        require : true , 
        type : String
    }
} , { timestamps : true})

const Product = mongoose.model("Product" , productSchema)

module.exports  = Product