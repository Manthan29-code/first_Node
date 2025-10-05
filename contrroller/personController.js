const { generateToken } = require('../middleware/jwt')
const Person = require('../models/person')


// addperson with no jwt token returned  
const addPerson = async(req , res)=>{
    try{
        const data = req.body 
        const response = await Person.create(data)
        res.status(202).json({
            data : response ,
            message : "Data saved successfully"
        })

    }catch(error){
        res.status(401).json({error : "invalid data"})
    }
}

// to get all person data 
const showAllPerson = async(req, res )=>{
    try {
        const response = await Person.find()
        res.status.json(response)

    }catch(error){
        res.status(500).json({message : "Internal Server Erro" ,
            error
        })
    }
}

// to get person by work 
const findByWork = async(req , res ) => {
    try{
        const workType = req.params.work;
        if ( workType == 'chef'  || workType == 'manager'  || workType == 'waiter'  ){
            const response = await Person.find({work :workType })
            res.status(200).json(response)
        }else{
             res.status(404).json({ error : "person not found"})
        }
    }catch(error){
         res.status(500).json({
            message : "Internal Server Erro" ,
            error
        })
    }
}

// find by  person id  
const updateById = async(req  , res )=> {
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
         res.status(500).json({
            message : "Internal Server Erro" ,
            error
        })
    }
}

// delete by id 
const deleteById = async(req  , res )=> {
    try{
        const id = req.params.id
       
        const response =  await Person.findByIdAndDelete(id )
        if(!response){
            return res.status(404).json({ error : "id not found"})
        }
        res.status(200).json({ response})
        console.log(" data deleted ")
    }catch(error){
         res.status(500).json({
            message : "Internal Server Error" ,
            error
        })
    }
}

const showProfile = async (req , res ) => {
    try {
        const user = req.user
        const userprofile = await Person.findById(user.id)
         res.status(200).json({user: userprofile})

    }catch(error){
         console.log("error => ", error)
        res.status(500).json({ error: " Internal server Error"})
    }
}

const login = async (req, res )=>{
    try{
        const { username , password} = req.body
        const user = Person.findOne({username : username})
        if(!user){ return res.status(401).json({ message : "username is not provided"})}
        if(! (await user.comparePassword( password))){ return res.status(401).json({ message : "username is not provided"})}
        const payload = {
            id : user.id ,
            username : user.username 
        }
        const token = generateToken(payload)
        res.status(200).json({
            token : token ,
            info : {id : user.id,
                    username : user.username
                } 
        })

    }catch(error){
        console.log("error => ", error)
        res.status(500).json({ error: " Internal server Error"})
    }
}

const signUp = async (req , res) => {
    try{
        const  data = req.body 
        const newPerson = await Person.create(data)
        const payload = {
            id : response.id,
            username : response.username     
        }
        const token = generateToken(payload)
        res.status(200).json({
            response : response , 
            token : token
        })


    }catch(error){
        console.log(" Error => ", error)
        res.status(500).json({ error : "Internal server Error"})
    }

}
module.exports = {
    addPerson ,
    showAllPerson,
    findByWork,
    updateById,
    deleteById,
    showProfile,
    login ,
    signUp
 }