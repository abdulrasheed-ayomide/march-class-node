const jwt = require("jsonwebtoken")
const envObj = require("../config/env")

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]; // Assuming the token is sent in the format "Bearer <token>"   

    try {
        console.log(envObj.jwtSecret)
        const decoded = jwt.verify(token, envObj.jwtSecret);

        console.log(decoded , "decode");
        

        req.user = decoded;
        next()

    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: "Unauthorized" })
    }
}

module.exports = { authMiddleWare }