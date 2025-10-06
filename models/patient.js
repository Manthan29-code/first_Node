const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    },
    diagnosedWith : {
        type : String,
        require : true 
    },
    address : {
        type : String , 
        require : true 
    },
    age : {
        type : Number ,
        require : true 
    },
    bloodGroup : {
        type : String ,
        require : true 
    },
    gender : {
        type : Sting ,
        enum : ["M" , "F"  , "O"],
        require : true 
    },
    admittedIn : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Hospital"

    }
}  ,{timestamps : true })


const Patient = mongoose.model("Patient" ,patientSchema )
module.exports = Patient