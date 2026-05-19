const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minlength: [3, "name must have aleast three characters"],
        trim: true,
    },

    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "use valid email Address"],
    },

    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
    },

    gender: {
        type: String,
        enum: ["male" || "female" || "prefer not to say"],
    },

    dob: {
        type: Date,
    },

    age: {
        type: Number,
        min: [18, "User must be 18years older"],
    },

    verificationCode: {
        type: String,
    },

    isverified: {
        type: Boolean,
        default: false,
    },
})
// console.log(userSchema);


module.exports = mongoose.model("user", userSchema)