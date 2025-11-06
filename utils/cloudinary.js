const cloudinary  = require("cloudinary").v2
const fs = require("fs")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadCloudinary = async ( localFilePath )=> {
    try {
        if(!localFilePath){
            return null
        }

        const response = await cloudinary.uploader.upload(localFilePath)

        fs.unlinkSync(localFilePath)
        return response

    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

function extractPublicId(url) {
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1729515998/foldername/abc123.jpg
  const parts = url.split("/");
  const lastPart = parts.pop(); // abc123.jpg
  const versionIndex = parts.findIndex(p => p.startsWith("v")); // index of version (like v1729515998)
  const folderPath = parts.slice(versionIndex + 1).join("/"); // foldername

  const publicId = folderPath ? `${folderPath}/${lastPart.split(".")[0]}` : lastPart.split(".")[0];
  return publicId;
}


const removeOldImage = async ( oldUrl) => {

    const publicId = extractPublicId(oldUrl)
    try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
module.exports = {uploadCloudinary , removeOldImage}