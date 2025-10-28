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


const generateToken = ( userData)=>{
    return jwt.sign(userData , process.env.JWT_TOKEN , {expiresIn : 30000})
}

module.exports = { jwtAuthMiddleware , generateToken , verifyJWT}