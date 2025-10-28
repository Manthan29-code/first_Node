const jwt = require('jsonwebtoken')
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { User} = require("../models/user.model")

const verifyJWT = asyncHandler( async (req , _ , next ) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
        if(!token){
            throw new ApiError(401 , "Unauthorize user")
        }

        const decodedToken  = jwt.verify( token , process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;  // smartest move
        next()
    }catch(error ){
         throw new ApiError(401, error?.message || "Invalid access token")
    
    }
})

// const jwtAuthMiddleware = ( req , res, next)=>{

//     //first Check request headers has authorization or not 
//     const authorization = req.headers.authorization
//     if (!authorization) return res.status(401).json({ error : "Token Not Found"})

//     // Extract the jwt token from the request header

//     const token = req.headers.authorization.split(' ')[1];
//     if(!token) return res.status(401).json({error : "unAuthorization"})
//     try{
//         // Verify the jwt token
//         const decode = jwt.verify(token , process.env.JWT_TOKEN)
        
//         // attach user information to the request object
//         req.user = decode 
//         next()
    
//     }catch(error){
//         console.log(error)
//         res.status(401).json({error : "invalid token "})
//     }
// }

const generateToken = ( userData)=>{
    return jwt.sign(userData , process.env.JWT_TOKEN , {expiresIn : 30000})
}

module.exports = { jwtAuthMiddleware , generateToken , verifyJWT}