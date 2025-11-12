const { Like } = require("../models/like.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require("../utils/ApiResponse")
const mongoose = require("mongoose")

//===================== toggle like ======================================//

const toggleLike = asyncHandler(async(req , res ) => {
    const { videoId} = req.params
    const userId = req.user._id

    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" })
    }

    const existingLike = await Like.findOne(
        {
            video : videoId ,
            likedBy : userId 
        }
    )

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json({
            message: "Like removed (unLiked successfully)",
            liked: false,
        })
    }else{
        await Like.create({
            video: videoId,
            likedBy: userId,
        });
        return res.status(200).json({
            message: "Video liked successfully",
            liked: true,
        });
    }
})

//===================== toggle commentLike ======================================//
const toggleComment = asyncHandler(async(req , res ) => {
    const { commentId} = req.params
    const userId = req.user._id

    if (!mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" })
    }

    const existingComment = await Like.findOne(
        {
            comment : commentId ,
            likedBy : userId 
        }
    )

    if (existingComment){
        await Like.findByIdAndDelete(existingComment._id)
        return res.status(200).json({
            message: "like on comment removed (unLiked successfully)",
            liked: false,
        })
    }else{
        await Like.create({
            comment: commentId,
            likedBy: userId,
        });
        return res.status(200).json({
            message: "comment  liked successfully",
            liked: true,
        });
    }
})
//===================== toggle tweetLike ======================================//
const toggleTweet = asyncHandler(async(req , res ) => {
    const { tweetId} = req.params
    const userId = req.user._id

    if (!mongoose.isValidObjectId(tweetId)) {
        return res.status(400).json({ message: "Invalid tweet ID" })
    }

    const existingTweet = await Like.findOne(
        {
            tweet : tweetId ,
            likedBy : userId 
        }
    )

    if (existingTweet){
        await Like.findByIdAndDelete(existingTweet._id)
        return res.status(200).json({
            message: "like on tweet removed (unLiked successfully)",
            liked: false,  // will use it for conditional rendering in frontend
        })
    }else{
        await Like.create({
            tweet: tweetId,
            likedBy: userId,
        });
        return res.status(200).json({
            message: "tweet  liked successfully",
            liked: true,
        });
    }
})

// =======================================get Liked Video ==============================//

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId = req.user._id

    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" })
    }

    const likedVideoList = Like.find({ likedBy: userId , video : { $ne : null} } ).populate("video").sort({ createdAt : -1})

    return res.status(200).json( new ApiResponse(200 , 
        {
            success: true,
            count: likedVideoList.length,
            likedVideos: likedVideoList.map((like) => like.video),
        } , ""
    ));
})

module.exports = { toggleComment, toggleLike, toggleTweet, getLikedVideos }