const musicmodel = require("../models/music.model");
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
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    // Minimal implementation: validate input and respond.
    const uri = req.body.uri;
    const title = req.body.title;

    if (!uri || !title) {
        return res.status(400).json({ message: "uri and title are required" });
    }

    // Full DB create omitted for now; return a success placeholder.
    return res.status(201).json({ message: "Music added (placeholder)" });
}

module.exports = {
    addMusic: createMusic,
};
    