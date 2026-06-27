const musicmodel = require("../models/music.model");
const { uploadImage } = require("../services/storage.service");
const jwt = require("jsonwebtoken");


async function createMusic(req, res) {

    const token = req.cookies && req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "you do not have the access to add music" });
        }
    

    // Use multer-provided file and validate input
    const file = req.file;
    const { title } = req.body;

    if (!file || !title) {
        return res.status(400).json({ message: "file and title are required" });
    }

    // uploadImage expects base64 string
    const fileData = await uploadImage(file.buffer.toString("base64"));

    const music = await musicmodel.create({
        uri: fileData,
        title,
        artist: decoded.id
    });

    return res.status(201).json(music);
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {
    createMusic
}