const { Playlist } = require("../models/playlist.model")
const { ApiError } = require("../utils/ApiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require("../utils/ApiResponse")
const mongoose = require("mongoose")


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if ( !name || !description){
        throw new ApiError(400 , "name or description not provided ")
    }

    const playlist = await Playlist.create({
        name : name ,
        description : description, 
        owner : req.user._id
    })

    if(playlist){
        return res.status(201).json(new ApiResponse(201 , {
            playlist : playlist
        } ,
        "playlist created successfully"
    ))}
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new ApiError(404, "invalid userID or not  provided ")
    }
    const getPlaylist  = await Playlist.find({owner : userId})
    if (getPlaylist) {
        res.status(200).json(new ApiResponse(200, {
            getPlaylist: getPlaylist
        }
        ))
    } 
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(404, "invalid userID or not  provided ")
    }
    const getPlaylist = await Playlist.findById(playlistId).populate("videos")
    if (getPlaylist) {
        res.status(200).json(new ApiResponse(200, {
            getPlaylist: getPlaylist
        }
        ))
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    // we can check playlistId and videoId is it proper mongoose  or not 
    // we have assumed that playlistId and videoId are  correct
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId , 
        {
            $push: { videos: videoId }
        },
        {new  : true }
    )

    if (updatedPlaylist) {
        res.status(200).json(new ApiResponse(200, {
            updatedPlaylist: updatedPlaylist
        }
        ))
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    // we can check playlistId and videoId is it proper mongoose  or not 
    // we have assumed that playlistId and videoId are  correct
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )

    if (updatedPlaylist) {
        res.status(200).json(new ApiResponse(200, {
            updatedPlaylist: updatedPlaylist
        }
        ))
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(404, "invalid userID or not  provided ")
    }
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId).populate("videos")
    if (deletedPlaylist) {
        res.status(200).json(new ApiResponse(200, {
            massage : "playlist deleted"
        }
        ))
    }
    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
    if ( !name || !description ){
        throw new ApiError(400 , "name or description is missing" )
    }
    const newPlaylist = await Playlist.findByIdAndUpdate(playlistId , {
        name : name , 
        description: description,
    } , 
    {new : true }
    )
    if(newPlaylist){
        res.status(202).json(new ApiResponse(202 , {
            newPlaylist: newPlaylist
        } , 
        "playlist created "
    ))
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}