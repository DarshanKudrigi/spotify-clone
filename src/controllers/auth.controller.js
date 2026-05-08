const usermodel = require("../models/user.model");


async function registeruser(req, res) {
    const {username,email,password,role="user"} = req.body;
    
}