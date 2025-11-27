const { Subscription } = require("../models/subscription.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require("../utils/ApiResponse")
const mongoose = require("mongoose")

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user._id

    if (!mongoose.isValidObjectId(channelId)) {
        return res.status(400).json({ message: "Invalid channelId " })
    }

    const existingSubScription = await Subscription.findOne(
        {
            subscriber: userId,
            channel: channelId
        }
    )

    if (existingSubScription) {
        await Subscription.findByIdAndDelete(existingSubScription._id)
        return res.status(200).json(new ApiResponse( 200 , 
            {
                message: "subscription removed ",
                isSubscribed: false,
            }
            , "subscription removed successfully"
        ))
    } else {
        await Subscription.create({
            subscriber: userId,
            channel: channelId,
        });
        return res.status(200).json(new ApiResponse(200,
            {
                message: "subscription added ",
                isSubscribed: true,
            }
            , "subscription added successfully"
        ));
    }
    
})



const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if ( !channelId || !mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId ")
    }

    const subscriberList = await Subscription.find({ channel: channelId }).populate("subscriber", "username email avatar");

    return res.status(200).json(new ApiResponse(200,
        {
            success: true,
            count: subscriberList.length,
            subscribers: subscriberList && [],
        }, 
        "Fetched subscribers successfully"
    ))


})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID format");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username email avatar") // only selected fields from User
        

    if (!subscriptions.length) {
        return res.status(200).json(new ApiResponse(200,
            {
                success: true,
                
                data: [],
            } ,
            "This user has not subscribed to any channels yet.",
        ))
    }

    const subscribedChannels = subscriptions.map((sub) => sub.channel);

    res.status(200).json( new ApiResponse(200 , 
        {
            success: true,
            count: subscribedChannels.length,
            channels: subscribedChannels,
        }
    ));
});



modules.exports = { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }
