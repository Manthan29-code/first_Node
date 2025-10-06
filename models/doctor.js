const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    name : {
        type : String , 
        require : true
    },
    salary : {
        type : Number , 
        require : true
    },
    qualification : {
        type : String , 
        require : true
    },
    experience : {
        type : Number ,
        require : true
    },
    worksInHospitals : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Hospital"
        }
    ]

}  ,{timestamps : true })


const Doctor = mongoose.model("Doctor" ,doctorSchema )
module.exports = Doctor