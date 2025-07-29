const express = require('express')
const Person = require('../models/person')
const router = express.Router();

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