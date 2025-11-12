const { Comment } = require("../models/Comment.model")
const {Video} = require("../models/video.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require("../utils/ApiResponse")
const mongoose = require("mongoose")

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" })
    }

    const commentList = (await Comment.find({video : videoId}))
                                      .populate("owner" ,  "userName avatar email")
                                      .skip((page-1)*limit)
                                      .limit(limit)
    
    res.status(200).json(new ApiResponse(200 ,
        {
            page : page ,
            limit : limit ,
            length: commentList.length,
            list: commentList || []

        },
        "comment list fetched successfully"
    ))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const newComment = req.body.newComment
    const { videoId } = req.params
    const userId = req.user._id

    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" })
    }

    if (!newComment || newComment.trim() === "") {
        return res.status(400).json({ message: "Comment content required" });
    }

    const videoExists = await Video.findById(videoId)
    if (!videoExists) {
        return res.status(404).json({ message: "Video not found" });
    }
    
    const comment = await Comment.create({
        content: newComment,
        video: videoId,
        owner: userId,
    });

    res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );



})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const { updatedContent } = req.body;

    if (!mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    if (!updatedContent || updatedContent.trim() === "") {
        return res.status(400).json({ message: "Updated content required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.owner.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.content = updatedContent;
    await comment.save();

    res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.owner.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});


module.exports = {
    getVideoComments ,
    updateComment , 
    deleteComment
}