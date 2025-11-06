const { User } = require("../models/user.model")
const { ApiError}  = require("../utils/ApiError")
const { asyncHandler }  = require("../utils/asyncHandler")
const { ApiResponse}  = require("../utils/ApiResponse")
const { uploadCloudinary  , removeOldImage} = require("../utils/cloudinary")
const jwt = require('jsonwebtoken')
const { default: mongoose } = require("mongoose")

//==============aidFunction =====================?/

const genAccessRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefresHToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken , refreshToken}

    }catch{
        throw new ApiError( 500 , "Something went wrong while generating refresh and access token")
    }
}


//====================== registerUser =================================//
const registerUser = asyncHandler( async (req, res) => {
    console.log("inside registerUser")
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName , email , username , password} = req.body 

    if( [fullName , email , username , password].some((field) => field.trim() === "")){
        throw new ApiError(400 , "ALl fields  are require ")
    }
    console.log(" all field are available")

    const exitedUser = await User.findOne({
        $or : [ {username } , { email }]
    })

    if(exitedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path 
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log({ avatarLocalPath})
    let coverImageLocalPath;

    if ( req.files && Array.isArray(req.files.coverImage ) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    
    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

    }
)

//==================== loginUser ============================= //

const loginUser = asyncHandler( async (req, res ) => {
    console.log("inside loginUser")
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const { email , username , password }  = req.body

    if(!username && !email ){
        throw new ApiError(400 , "username of email is require ")
    }

    const user = await User.findOne({
        $or : [{username} , {email}]
    })

    const isPasswordValid = await user.idPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken , refreshToken} = await genAccessRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken")

    const option = {
        httpOnly : true , 
        secure : true 
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , option )
    .cookie("refreshToken" , refreshToken , option )
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

//=============================logoutUser===========================================//

const logoutUser = asyncHandler( async ( req, res ) => {
    console.log("inside logoutUser")
    if(!req.user){
        throw new ApiError(401, "your are already loggedOut")
    }
    await User.findByIdAndUpdate(
        req.user._id ,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    )

    const option ={
        httpOnly : true , 
        secure : true 
    }

    return res
    .status(200)
    .clearCookie( "accessToken" , option)
    .clearCookie( "refreshToken" , option)
    .json(new ApiResponse(200, req.user.username, "User  logged Out"))

})

//=====================================refreshAccessToken =====================================//

const refreshAccessToken = asyncHandler( async( req , res ) => {
    const incomingRefreshToken = req.cookies.refreshToken  || req.body.refreshToken

    if(! incomingRefreshToken){
        throw new ApiError( 401 ,  "unauthorized  request")
    }

    try{
        const decodedToken = jwt.decode(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET )
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }

        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await genAccessRefreshToken(user._id)
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )


    }catch(error){
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})
//========================================change Current Passowrd ================================//

const changeCurrentPassword = asyncHandler( async( req , res ) => {
    const { oldPassword , newPassword } =  req.body 

    const user = await User.findById(req.user?._id) 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if( !isPasswordCorrect ){
        throw new ApiError( 400 , "invalid old password ")
    }


    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))

})

//========================================get currentUser =======================================//
const getCurrentUser = asyncHandler( async ( req, res ) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})


//=========================================== updateAccountDetails ========================//
const updateAccountDetails = asyncHandler( async(req , res )=> {
    const { fullName , email} = req.body

    if( !fullName  || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id ,
        {
            $set : {
                fillName : fullName , 
                email : email
            }
        },
        { new : true}
    ).select(" -password ")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))

})


//=========================================Update User Avatar ==================================//
const updateUserAvatar = asyncHandler(async (req , res ) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    if(req.user.avatar) { 
       const result = await removeOldImage(req.user.avatar)
       console.log( "old image deleted " , result)
    }


    const avatar = await uploadCloudinary(avatarLocalPath)
 
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar") 
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id ,
        {
            $set : {
                avatar : avatar.url
            }
        },
        { new : true}

    ).select(" -password ")

    return res
    .status(200) 
    .json(
         new ApiResponse(200, user, "Avatar image updated successfully")
    )

})

//=========================================Update Cover Image ==================================//


const updateCoverImage = asyncHandler(async (req , res ) => {

    const coverImageLocalPath = req.file?.path
    if(req.user.coverImage) { 
       const result = await removeOldImage(req.user.coverImage)
       console.log( "old image deleted " , result)
    }
    if (!coverImageLocalPath) {
        throw new ApiError(400, "cover Image file is missing")
    }

    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on coverImage") 
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id ,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        { new : true}

    ).select(" -password ")

    return res
    .status(200) 
    .json(
         new ApiResponse(200, user, "Cover image updated successfully")
    )

})

//===========================================ChannelProfile =====================================//


const getUserChannelProfile = asyncHandler( async ( req , res) => {
    const { username } = req.prams 

    if(!username?.trim()){
        throw new ApiError( 400 , "username is missing ")

    }

    const channel = await User.aggregate([
        {
            $match : {
                username : username?.toLowerCase()
            }
        },
        {
            $lookup : {
                from : "subscriptions" , 
                localField : "_id" ,
                foreignField : "channel", 
                as: "subScribers"
            }
        },
        {
            $lookup : {
                from : "subscriptions" , 
                localField : "_id" ,
                foreignField : "subscriber", 
                as: "subscribedTo"
            }
        },
        {
            $addFields : {
                subscriberCount : {
                    $size : "$subScribers"
                } ,
                channelSubscribedTOCount : {
                    $size : "$subscribedTo"
                },
                isSubscribed : {
                    $cond : {
                        if : { $in : [req.user?._id , "$subScribers.subScriber"]} ,
                        then : true , 
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                fullName : 1 ,
                username : 1 ,
                subscriberCount : 1 ,
                channelSubscribedTOCount : 1 ,
                isSubscribed : 1 ,
                avatar : 1,
                coverImage : 1 ,
                email : 1 ,
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError( 404  , "Channel does not exist ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})


//================================get watch history =========================================//


const getWatchHistory =  asyncHandler( async ( req, res) => {
    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup : {
                from : "videos" ,
                localField : "watchHistory" ,
                foreignField : "_id" ,
                as : "watchHistory",
                pipeline : [
                    {
                        $lookup : {
                            from : "users" ,
                            localField : "owner" ,
                            foreignField : "__id" ,
                            as : "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields : {
                            owner : {
                                $first : "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return rew
    .status(200) 
    .json(
        new ApiResponse(
            200 , 
            user[0].watchHistory,
            "match history fetched successfully"
        )
    )
})

module.exports = { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getCurrentUser,
    changeCurrentPassword,
    getUserChannelProfile,
    getWatchHistory
}