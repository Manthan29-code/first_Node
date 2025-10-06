const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    addressLine1 : {
        type : String,
        require : true
    },
    addressLine2 : {
        type : String,        
    },
    city : {
        type : String ,
        require : true 
    },
    pincode  : {
        type : String,
        require : true
    },
    specializedIn : [
        {
            type : String , 
            
        }
    ]

}  ,{timestamps : true })


const Hospital = mongoose.model("Hospital" ,hospitalSchema )
module.exports = Hospital