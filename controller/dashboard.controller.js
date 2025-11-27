const { Like } = require("../models/like.model")
const {Video} = require("../models/video.model")
const { Subscription } = require("../models/subscription.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require("../utils/ApiResponse")
const mongoose = require("mongoose")



const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id
    const totalStatus = await Video.aggregate([
        {
            $match : {
                owner : channelId
            }
        },
        {
            $lookup : {
                from : "likes" , 
                localField : "_id" ,
                foreignField : "video" ,
                as : "likes"   
            }
        },
        {
            $group: {
                _id: null,                       // group by owner
                totalVideos: { $sum: 1 },            // count videos
                totalViews: { $sum: "$views" },      // sum of views
                totalLikes: { $sum: { $size: "$likes" } } // sum length of likes array per video
            }
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1,
                totalLikes: 1
            }
        }
    ])
    const totalSubscriber = await Subscription.countDocuments({ channel : channelId})

    return res.status(202).json(new ApiResponse(202 , 
        {
            totalVideos: totalStatus.totalVideos,
            totalViews: totalStatus.totalViews,
            totalLikes: totalStatus.totalLikes,
            totalSubscriber: totalSubscriber
        }
    ))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { videoId } = req.params // this is user id and we need to find all the video uploaded by this user
    if( !videoId || !mongoose.isValidObjectId(videoId)){
        throw new ApiError(404 , "invalid id")
    }
    const videoList = await Video.find({owner : videoId})

    if(videoList.length() > 0){
        return res.status(200).json(new ApiResponse(200,
            {
               videoList : videoList
            }
        ))
    }else{
        return res.status(200).json(new ApiResponse(200,
            {
                videoList: []
                
            },
            "this channel hasn't uploaded any video "
        ))
    }

})

module.exports = {
    getChannelStats , 
    getChannelVideos
}