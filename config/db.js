const mongoose  = require("mongoose")
require('dotenv').config()


//const mongoURL = process.env.MONGO_URL
const mongoURL = process.env.Local_URL
 
mongoose.connect( mongoURL , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    // ssl: true,
})

const db = mongoose.connection 

db.on( 'connected' ,  ()=> {
    console.log("Connected to MongoDb server")
})

db.on( 'error' ,  (error)=> {
    console.log("MongoDb connection error" , error)
})

db.on( 'disconnected' ,  ()=> {
    console.log("disConnected to MongoDb server ")
})

module.exports = db