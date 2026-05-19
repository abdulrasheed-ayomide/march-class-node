const express = require("express")
const { register, verifyEmail, login, currentUser } = require("../controller/user")
const {     authMiddleWare } = require("../middleware/verifyToken")
const { loginValidator, registerValidator } = require("../validator/user")

const router = express.Router()

router.post("/register", registerValidator, register)
router.post("/login", loginValidator, login)
router.get("/currentUser", authMiddleWare, currentUser)
router.post("/verify-email", verifyEmail)
module.exports = router