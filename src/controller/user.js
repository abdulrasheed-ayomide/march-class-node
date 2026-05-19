const user = require("../models/user");
const bcrypt = require("bcrypt");
const envObj = require("../config/env");
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator");
const { sendWelcomingEmail, sendVerificationEmail } = require("../utils/email");


// REGISTER A NEW USER
const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()?.[0].msg
        });
    }

    const { name, email, password, age } = req.body;

    // GENERATE OTP
    let otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // if otp exixts, regenerate another otp cus if one thousand users register at the same time, they might get the same otp and that will cause a problem when they try to verify their email
        const existingOtp = await user.findOne({ verificationCode: otp });
        if (existingOtp) {
            otp = Math.floor(100000 + Math.random() * 900000).toString();
        }


        if (!name || !email || !password || !age) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing user
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const salt = 12;

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new user({
            name,
            email,
            password: hashedPassword,
            age,

            verificationCode: otp,

            isverified: false,
        });

        // Save user
        await newUser.save();

        // SEND OTP EMAIL
        await sendVerificationEmail(email, otp);

        return res.status(201).json({
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// LOGIN A USER

const login = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // 3. Respond with a 400 status and the list of errors
        return res.status(400).json({ errors: errors.array()?.[0].msg });
    }
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Find the user by email
        const existingUser = await user.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        // console.log(existingUser.isverified, ".....isverified line 105");
        if (!existingUser.isVerified) {

            // GENERATE NEW OTP
            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            // SAVE NEW OTP
            existingUser.verificationCode = otp;

            await existingUser.save();

            // SEND NEW OTP
            await sendVerificationEmail(
                existingUser.email,
                otp
            );

            return res.status(400).json({
                message:
                    "Email not verified. New OTP sent to your email"
            });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password)
        console.log(isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ userId: existingUser._id }, envObj.jwtSecret, { expiresIn: envObj.jwtExpiresIn })

        //  res.status(200).json({ message: "Login successful", token })
        const userData = {
            name: existingUser.name,
            id: existingUser._id,
            gender: existingUser.gender,
            email: existingUser.email,
            age: existingUser.age,
        };
        res.status(200).json({
            status: true,
            message: "Login successfully",
            token,
            user: userData,
        });

    } catch (error) {

        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

//CURRENT USER
const currentUser = async (req, res) => {

    // Assuming you have the user ID stored in the request object after authentication
    const userId = req.user.userId;
    console.log(userId, "userId");

    if (!userId) {
        return res.status(404).json(null)
    }

    // Exclude the password field from the response}
    const userData = await user.findById(userId).select("-password");

    res.json({ user: userData })

}

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
    try {

        const { email, otp } = req.body;

        console.log(req.body);

        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        console.log(existingUser);


        console.log(existingUser.verificationCode);
        console.log(otp);

        if (
            !existingUser.verificationCode ||
            existingUser.verificationCode.toString() !== otp.toString()
        ) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        existingUser.isverified = true;

        existingUser.verificationCode = null;

        await existingUser.save();

        console.log(existingUser.email);

        await sendWelcomingEmail(
            existingUser.name,
            existingUser.email
        );

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
module.exports = { register, login, currentUser, verifyEmail }