const mongoose = require("mongoose");

const todoappSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "text is required"],
        date: {type: Date,
        default: Date.now}
    }
});

module.exports = mongoose.model("todoapp", todoappSchema)
