const express = require('express')
const router = express.Router();
const { registerUser, loginUser, logoutUser, refreshAccessToken, updateAccountDetails, updateUserAvatar, updateCoverImage, getCurrentUser, changeCurrentPassword, getUserChannelProfile, getWatchHistory} = require('../controller/user.controller')
const upload = require("../middleware/multerMiddleware")
const { verifyJWT } = require("../middleware/jwt")

const uploadFields = upload.fields([
    {
        name : "avatar" ,
        maxCount : 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
])

router.post('/register' , uploadFields , registerUser )
router.post('/login' , loginUser )
router.get('/logout' , verifyJWT ,logoutUser )
router.post("/refresh-accessToken" , refreshAccessToken)
router.get("/change-password" , verifyJWT , changeCurrentPassword)
router.get("/current-user" , verifyJWT , getCurrentUser)
router.patch("/update-account" , verifyJWT ,updateAccountDetails )
router.post('/avatar' , verifyJWT ,upload.single("avatar"), updateUserAvatar )
router.post("/cover-image" , verifyJWT , upload.single("coverImage") , updateCoverImage)
router.get("c/:username" , verifyJWT , getUserChannelProfile)
router.get("/history" , verifyJWT, getWatchHistory)

module.exports = router
