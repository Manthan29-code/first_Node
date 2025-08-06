const jwt = require('jsonwebtoken')


const jwtAuthMiddleware = ( req , res, next)=>{

    //first Check request headers has authorization or not 
    const authorization = req.headers.authorization
    if (!authorization) return res.status(401).json({ error : "Token Not Found"})

    // Extract the jwt token from the request header

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error : "unAuthorization"})
    try{
        // Verify the jwt token
        const decode = jwt.verify(token , process.env.JWT_TOKEN)
        
        // attach user information to the request object
        req.user = decode 
        next()
    
    }catch(error){
        console.log(error)
        res.status(401).json({error : "invalid token "})
    }
}

const generateToken = ( userData)=>{
    return jwt.sign(userData , process.env.JWT_TOKEN , {expiresIn : 30000})
}

module.exports = { jwtAuthMiddleware , generateToken}