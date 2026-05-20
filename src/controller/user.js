const user = require("../models/user");
const bcrypt = require("bcrypt");
const envObj = require("../config/env");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const {
    sendWelcomingEmail,
    sendVerificationEmail
} = require("../utils/email");



// ========================================
// REGISTER USER
// ========================================

const register = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()?.[0]?.msg
        });
    }

    const { name, email, password, age } = req.body;

    try {

        // CHECK REQUIRED FIELDS
        if (!name || !email || !password || !age) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // CHECK EXISTING USER
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // GENERATE UNIQUE OTP
        let otp;
        let existingOtp;

        do {

            otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            existingOtp = await user.findOne({
                verificationCode: otp
            });

        } while (existingOtp);

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 12);

        // CREATE USER
        const newUser = new user({
            name,
            email,
            password: hashedPassword,
            age,

            verificationCode: otp,

            verificationCodeExpires:
                Date.now() + 10 * 60 * 1000,

            isverified: false
        });

        // SAVE USER
        await newUser.save();

        // SEND OTP EMAIL
        await sendVerificationEmail(email, otp);

        return res.status(201).json({
            status: true,
            message: "OTP sent to your email"
        });

    } catch (error) {

        console.log(error.message);

        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};



// ========================================
// VERIFY EMAIL / OTP
// ========================================

const verifyEmail = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        // FIND USER
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // CHECK OTP
        if (
            !existingUser.verificationCode ||
            existingUser.verificationCode.toString() !== otp.toString()
        ) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // CHECK OTP EXPIRATION
        if (
            existingUser.verificationCodeExpires <
            Date.now()
        ) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // VERIFY USER
        existingUser.isverified = true;

        // CHECK IF USER IS VERIFIED
        // if (!existingUser.isverified) {

        //     return res.status(400).json({
        //         verified: false,
        //         email: existingUser.email,
        //         message: "Please verify your email first"
        //     });
        // }

        // CLEAR OTP
        existingUser.isverified = true;
        existingUser.verificationCode = null;
        existingUser.verificationCodeExpires = null;

        await existingUser.save();

        // SEND WELCOME EMAIL
        await sendWelcomingEmail(
            existingUser.name,
            existingUser.email
        );

        return res.status(200).json({
            status: true,
            message: "Email verified successfully"
        });

    } catch (error) {

        console.log(error.message);

        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};



// ========================================
// LOGIN USER
// ========================================

const login = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()?.[0]?.msg
        });
    }

    const { email, password } = req.body;

    try {

        // CHECK REQUIRED FIELDS
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // FIND USER
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // CHECK IF VERIFIED
        if (!existingUser.isverified) {

            return res.status(400).json({
                verified: false,
                email: existingUser.email,
                message: "Please verify your email first"
            });
        }

        // VERIFY PASSWORD
        const verifyPassword = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!verifyPassword) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // GENERATE TOKEN
        const token = jwt.sign(
            {
                userId: existingUser._id
            },
            envObj.jwtSecret,
            {
                expiresIn: envObj.jwtExpiresIn
            }
        );

        // USER DATA
        const userData = {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            age: existingUser.age,
            gender: existingUser.gender
        };

        return res.status(200).json({
            status: true,
            message: "Login successful",
            token,
            user: userData
        });

    } catch (error) {

        console.log(error.message);

        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};



// ========================================
// CURRENT USER
// ========================================

const currentUser = async (req, res) => {

    try {

        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userData = await user
            .findById(userId)
            .select("-password");

        if (!userData) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user: userData
        });

    } catch (error) {

        console.log(error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// ========================================
// RESEND / OTP
// ========================================

const resendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        const existingUser = await user.findOne({
            email
        });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // GENERATE NEW OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        existingUser.verificationCode = otp;

        existingUser.verificationCodeExpires =
            Date.now() + 10 * 60 * 1000;

        await existingUser.save();

        await sendVerificationEmail(
            email,
            otp
        );

        return res.status(200).json({
            message: "New OTP sent"
        });

    } catch (error) {

        console.log(error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    register,
    login,
    currentUser,
    verifyEmail,
    resendOtp
};