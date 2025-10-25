const express = require('express')
const router = express.Router();
const { registerUser } = require('../controller/user.controller')
const upload = require("../middleware/multerMiddleware")
// const { verifyJWT } = require("../middleware/jwt")

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

module.exports = router
