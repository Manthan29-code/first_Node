const mongoose = require("mongoose")

const orderItemSchema  = new mongoose.Schema({
    productId  :  {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Product"
    } ,
    quantity : {
        type : Number ,
        require : true 
    }        
})
const orderSchema = new mongoose.Schema({
    orderPrice : {
        type : String ,
        require : true 
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    orderItems : {
        type : [ orderItemSchema]
    },
    address :  {
        type : String , 
        required : true
    },
    status : {
        type : String , 
        enum : [ "PENDING" , "CANCELLED" , "DELIVERED"], 
        default : "PENDING"
    }
} , 
{ timestamps : true }
)

const Order = mongoose.model("Order" , orderSchema)

module.exports = Order 