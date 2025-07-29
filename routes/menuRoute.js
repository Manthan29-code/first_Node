const express = require('express')
const MenuItem = require('../models/MenuItems')
const router = express.Router();

router.post( '/' , async (req , res)=>{
    try{
        const data = req.body        
        const response = await MenuItem.create(data)
        console.log(" data Saved")
        res.status(200).json(response)
    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})
    }
})


router.get('/' , async (req , res ) => {
    try{  
        const response =await  MenuItem.find()
        console.log(" data fetched")
        res.status(200).json(response)

    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    } }
)

router.get('/:taste' , async (req , res ) => {
    try{  
        const taste = req.params.taste 
        if ( taste == 'sweet' || taste == 'spicy' || taste == 'spur' )  
        {
            const response = await MenuItem.find({taste :taste  })
            console.log(" data fetched")
            res.status(200).json(response)
        }else{
            res.status(404).json({ error : "item not found"})
        }    
        

    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    } }

)

router.put('/:id' , async(req , res)=>{
    try{
        const id = req.params.id
        const updatedData = req.body
        const response =  await MenuItem.findByIdAndUpdate(id , updatedData, {
            new : true, 
            runValidators : true
        })
        if(!response){
            return res.status(404).json({ error : "id not found"})
        }
        res.status(200).json(response)
        console.log(" data updated ")
    }catch(error){
        console.log("error msg=> " , error)
        res.status(500).json({ error : " Internal server error"})

    }
})

router.delete('/:id' , async (req , res)=>{
    try{
        const id = req.params.id
        const response =  await MenuItem.findByIdAndDelete(id )
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
module.exports = router