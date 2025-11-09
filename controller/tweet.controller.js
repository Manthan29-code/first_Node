const {Tweet} = require("../models/tweet.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require("../utils/ApiResponse")
const mongoose = require("mongoose")

//=================================create Tweet =========================================//
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body 
    const owner = req.user._id // loggedIn user id 
    
    if (!content){
        throw new ApiError(400 , "content is not given")
    }
    const tweet = await Tweet.create({
        content , owner
    })

    if (!content || !content.trim()) {
        throw new ApiError(500, "error while creating tweet  in db ")
    }

    res.status(201).json(new ApiResponse(201 , tweet , "tweet posted successfully"))


})

const getUserTweets = asyncHandler(async (req, res) => {
    const owner = req.user._id

    const tweetList = await Tweet.find({ owner: mongoose.Types.ObjectId(owner) }).sort({ createdAt: -1 })

    res.status(200).json(new ApiResponse(200 , tweetList , "tweet fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweet_id , content } = req.body 
    

    if (!tweet_id || !mongoose.isValidObjectId(tweet_id)) {
        throw new ApiError(400, "Invalid or missing tweet_id");
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    
    const updatedTweet = await Tweet.findOneAndUpdate(
        { _id: tweet_id, owner: req.user._id },
        { content: content.trim() },
        { new: true }
    );

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found or not authorized to update");
    }

    res.status(200).json(new ApiResponse(200, updatedTweet, "tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweet_id } = req.body

    if (!tweet_id || !mongoose.isValidObjectId(tweet_id)) {
        throw new ApiError(400, "Invalid or missing tweet_id");
    } 
    const deletedTweet = await Tweet.findOneAndDelete({
        _id: tweet_id,
        owner: req.user._id
    });

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found or not authorized to delete");
    }

    res.status(200).json(new ApiResponse(200, {}, "tweet deleted successfully"))

})
module.exports = { createTweet, getUserTweets, updateTweet, deleteTweet }