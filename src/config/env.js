const dotenv = require("dotenv")
dotenv.config();

const envObj = {
    port: process.env.PORT,
    mongoDbUrl: process.env.MONGODB_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    cloudName: process.env.CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUD_API_KEY,
    cloudinaryApiSecret: process.env.CLOUD_API_SECRET,
    appPassword: process.env.APP_PASSWORD,
    appEmail: process.env.APP_EMAIL,
}
// console.log(process.env);

module.exports = envObj