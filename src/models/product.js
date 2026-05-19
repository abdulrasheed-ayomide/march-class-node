const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [3, "Title must have atleast 3 characters"],
        maxlength: [100, "Title must not be more than 100 characters"],
        trim: true
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [12, "Description must have atleast 3 character"],
        maxlength: [300, "Description must not be more than 300 characters"],
        trim: true,
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 100
    },

    category: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    publicId: {
        type: String,
        required: true,
    },

})

module.exports = mongoose.model("product", productSchema)