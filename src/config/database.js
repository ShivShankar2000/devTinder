const mongoose = require('mongoose');

const connectDB = async (url) => {
   await mongoose.connect("mongodb+srv://shiv16941_db_user:MzMdEJkNWyPkOuYj@devtinder.pm5dcvd.mongodb.net/devTinder")
}

module.exports = connectDB;
