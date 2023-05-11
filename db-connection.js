require("dotenv").config();
const mongoose = require("mongoose");


// Database connection

const connection = async function connection () {
    try {
        const mongoInstance = await mongoose.connect(process.env.MONGODB_URI);
        return mongoInstance;
    } catch (error) {
        console.log("Check for database server status. Err details: \n" + error);
    }
}

module.exports = connection;
