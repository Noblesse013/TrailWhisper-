const cloudinary = require('cloudinary').v2;
require("dotenv").config();  

// Validate Cloudinary environment variables
const requiredCloudinaryVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredCloudinaryVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing Cloudinary environment variables:', missingVars);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  
  console.log("✅ Cloudinary configured successfully");
}

console.log("Cloudinary Uploader:", cloudinary.uploader ? "Loaded ✅" : "Not Loaded ❌");

module.exports = cloudinary;  
