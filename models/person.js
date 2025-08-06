const mongoose = require('mongoose')
const  bcrypt = require('bcrypt')
const personSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true ,
    },
    age : {
        type : Number, 
    },
    work : {
        type : String , 
        enum : [ 'chef' , 'waiter' , 'manager'],
        require : true
    },
    mobile: {
        type : String,
        require : true
   },
   email : {
        type : String,
        require : true ,
        unique : true ,  
   },
   address : {
        type : String,
        require : true 
   },
   username:{
        type: String,
        require : true
   },
   password:{
        type: String,
        require : true
   }
})

personSchema.pre( 'save' , async function (next){
     const person =this

     if(!person.isModified('password')){
          console.log(" Password field is not modified")
          return next()
     } 

     try{
          console.log(" Password field is  modified")
          console.log("Original password " , person.password)
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(person.password , salt)
          console.log("hashed password " , hashPassword)
          person.password = hashPassword 
          next()

     }catch(e){
          return next(err); 
     }
})

personSchema.methods.comparePassword = async function (candidatePassword){
     try{
          const isMatch = await bcrypt.compare( candidatePassword , this.password)
          return isMatch
     }catch(err){
          throw err
     }
}

const Person = mongoose.model( 'Person'  , personSchema)
module.exports = Person

// "username": "Alice_Smith",
//     "password": "$2b$10$GyIqEPizwtPcb55dLllfb.77iSJVdHlh2QcrVvcpSMThyZtCwSezu","Alice@Smith"


// "username" : "John_Doe",
//         "password" : 1245