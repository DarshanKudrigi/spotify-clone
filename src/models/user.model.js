const mongoose = require("mongoose");

const userschema = new  mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true},
    email: {
        type: String,
        required: true,
        unique: true},
    password: {
        type: String,
        required: true},
    role:{
        type: String,
    }
    });

const user = mongoose.model("User", userschema);

module.exports = user;