
const mongoose = require("mongoose");
const envObj = require("./env");


const connectDb = async () => {

    try {
        const connect = await mongoose.connect(envObj.mongoDbUrl);

        if (connect) {
            console.log("MongoDB Connected");
            
        }

    } catch (error) {
        console.log(error.message);
        return error
    }

}

module.exports = connectDb
