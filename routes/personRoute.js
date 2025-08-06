const express = require('express')
const Person = require('../models/person')
const router = express.Router();
const { jwtAuthMiddleware , generateToken} = require('./../jwt')


router.post( '/signup' , async(req , res)=>{
    try {
        const data = req.body // Assuming the request body contains the person data

        // Create a new Person document using the Mongoose model
        const newPerson = new Person(data)
        const response = await newPerson.save(); 
        console.log(" data saved")

        const payload = {
            id : response.id,
            username : response.username
            
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload)
        console.log(" Token is " , token)

        res.status(200).json({response : response , token : token })

    }catch(error){
        console.log(" Error => ", error)
        req.status(500).json({ error : "Internal server Error"})
    }
})

router.post( '/login' , async( req , res )=>{
    try{
        const {username , password} =req.body

        //find user by userName
        const user = await Person.findOne({username : username})

        // if user don't exit or password does not match , return error

        if(!user || !(await user.comparePassword( password))){
            return res.status(401).json({error : "Invalid Password or UserName"})
        }
        const payload = {
            id : response.id,
            username : response.username
            
        }
        const token = generateToken(payload)

        res.status(200).json({token : token})

    }catch(error){
        console.log("error => ", error)
        res.status(500).json({ error: " Internal server Error"})
    }
} )

router.get('/profile' , async(req, res)=>{
    try {
        const userDate = req.user
        console.log("User Data=> " , userData)

        const userId = userData.id
        const user = await Person.findById(userId)

        res.status(200).json({user})
    } catch (error) {
        console.log("error => ", error)
        res.status(500).json({ error: " Internal server Error"})
    }
})

router.post('/' , async (req , res ) => {
    try{
        const data = req.body
        const response = await Person.create(data)
        console.log(" data Saved")
        res.status(200).json(response)

    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    } }
)

router.get('/' , async (req , res ) => {
    try{  
        const response =await  Person.find()
        console.log(" data fetched")
        res.status(200).json(response)

    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    } }
)

router.get( '/:work' , async(req , res)=>{
    try{
        const workType = req.params.work
        if ( workType == 'chef'  || workType == 'manager'  || workType == 'waiter'  ){
            const response = await Person.find({work :workType })
            res.status(200).json(response)
        }else{
             res.status(404).json({ error : "person not found"})
        }

    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    }
})

router.put('/:id' , async (req , res)=>{
    try{
        const id = req.params.id
        const updatedData = req.body
        const response =  await Person.findByIdAndUpdate(id , updatedData ,{
            new : true, 
            runValidators : true
        })
        if(!response){
            return res.status(404).json({ error : "id not found"})
        }
        res.status(200).json({ response})
        console.log(" data updated ")
    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    }
})

router.delete('/:id' , async (req , res)=>{
    try{
        const id = req.params.id
        const response =  await Person.findByIdAndDelete(id )
        if(!response){
            return res.status(404).json({ error : "id not found"})
        }
        res.status(200).json({ message : "data deleted "})
        console.log(" data deleted ")
    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    }
})

module.exports= router 