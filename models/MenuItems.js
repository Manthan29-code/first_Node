const mongoose = require("mongoose")

const menuItemSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
    taste : {
        type : String,
        enum : [ 'sweet' , 'spicy' , 'spur'],
        require : true 
    },
    is_drink : {
        type : Boolean , 
        default : false 
    },
    ingredients : {
        type: [String],
        default : []
    },
    num_sales : {
        type : Number, 
        default : 0
    }

})

const MenuItem = mongoose.model('MenuItem' , menuItemSchema)

module.exports = MenuItem


