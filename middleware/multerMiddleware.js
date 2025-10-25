const multer = require("multer")

const storage = multer.diskStorage({
    destination : function( req, file , cb){
        console.log("inside destination of multer")
        cb( null , "./public/temp")
    },
    fileName : function ( req, file ,cb){
        console.log("inside destination of filename")
        cb(null , file.originalname)
    }
})

const upload = multer({ storage })

module.exports = upload