const { Video } = require("../models/video.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require("../utils/ApiResponse")
// const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2")
const { uploadCloudinary, removeOldImage } = require("../utils/cloudinary")
const jwt = require('jsonwebtoken')
const  mongoose  = require("mongoose")

//================get all video ================================================//
const getAllVideo = asyncHandler(async(req , res )=> {
    const {page = 1 , limit = 10 , query , sortBy = "timestamp" ,  sortType = -1 , userId } = req.query 

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const sortOrder = parseInt(sortType)

    if (!userId) {
        throw new ApiError(400, "userId is missing");
    }

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
    }
    const pipeline =[
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },
        { $sort: { [sortBy]: sortOrder } },
        {
            $project: {
                "ownerDetails.password": 0,
                "ownerDetails.refreshToken": 0,
                "ownerDetails.watchHistory": 0
            }
        }
    ]

    const option = { page : pageNum, limit : limitNum }
    
    const videoList =await  Video.aggregatePaginate(Video.aggregate(pipeline) , option)

    res.status(200).json(new ApiResponse(200, videoList  , "videoList served "))
    
})

// const videos = await Video.find(filter)
//     .populate("owner", "username email")
//     .sort({ [sortBy]: sortType })
//     .skip((page - 1) * limit)
//     .limit(limit);



const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const userId = req.user._id 
    const videoPath = req.files?.video[0]?.path 
    if(!videoPath){
        throw new ApiError(400 , "video is required")
    }

    const video = await uploadCloudinary(videoPath)

    let thumbnailPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailPath = req.files.thumbnail[0].path
    }


    const thumbnail = thumbnailPath ? await uploadCloudinary(thumbnailPath) : null;
    if (thumbnailPath && !thumbnail) throw new ApiError(500, "Thumbnail upload failed");


    const createdVideo = await Video.create({
        video : video.url ,
        thumbnail: thumbnail?.url || "" , 
        title ,
        description  ,
        duration: video.duration ,
        owner: new mongoose.Types.ObjectId(userId)
    })

    const getCreatedVideo = await Video.findById(createdVideo._id)
    if (!getCreatedVideo){
        throw new ApiError(400 , "video is not uploaded successfully")
    }
    res.status(201).json(new ApiResponse(200, getCreatedVideo, "video uploaded successfully"))
    // TODO: get video, upload to cloudinary, create video
})

//=====================================get video by id ================================//

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //If videoId is not a valid MongoDB ObjectId, Mongoose will throw an error.You can guard against that:

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    const video = await Video.findById(videoId)
    if (!video){
        throw new ApiError(404 , "video not found for given id")
    }

    res.status(200).json(new ApiResponse(200 , video , "video Found .."))
   
})

//================================delete video ======================================//

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    const video = await Video.findByIdAndDelete(videoId)
    if (!video) {
        throw new ApiError(400, "video not found for given id")
    }

    res.status(200).json(new ApiResponse(200, {}, "video deleted .."))
   // remove from cloudinary  --> implement this one ...
})

//================================= update video  =========================================//

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    const { title, description } = req.body

    const videoPath = req.files?.video[0]?.path

    if (!videoPath) {
        throw new ApiError(400, "video is required")
    }

    const video = await uploadCloudinary(videoPath)

    let thumbnailPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailPath = req.files.thumbnail[0].path
    }


    const thumbnail = thumbnailPath ? await uploadCloudinary(thumbnailPath) : null;
    if (thumbnailPath && !thumbnail) throw new ApiError(500, "Thumbnail upload failed");

    const updatedVideo = await Video.findByIdAndUpdate(videoId, 
        { videoFile: video?.url, thumbnail: thumbnail?.url || "", title, description  }, { new: true })

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully."));
})

//================================== togglePublishStatus ========================================================//

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video not found for given id")
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(200, video, `video id toggled to ${video.isPublished ? "published" : "unPublished"}`))
   
})
module.exports = { getAllVideo, publishAVideo, getVideoById, deleteVideo, updateVideo, togglePublishStatus }