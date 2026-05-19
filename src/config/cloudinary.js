const { cloudName, cloudinaryApiKey, cloudinaryApiSecret } = require("./env");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

module.exports = { cloudinary };