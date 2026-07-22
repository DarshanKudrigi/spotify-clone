const musicmodel = require("../models/music.model");
const { uploadMusicFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");

async function createMusic(req, res) {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to add music" });
    }

    const file = req.file;
    const { title } = req.body;

    if (!file || !title) {
      return res.status(400).json({ message: "file and title are required" });
    }

    const fileData = await uploadMusicFile(file);

    const music = await musicmodel.create({
      uri: fileData,
      title,
      artist: decoded.id,
    });

    return res.status(201).json(music);
  } catch (error) {
    console.error("music upload error", error);
    return res.status(401).json({ message: "Invalid token or upload failed" });
  }
}

async function getMusic(req, res) {
  try {
    const songs = await musicmodel.find().populate("artist", "username email");
    return res.status(200).json(songs);
  } catch (error) {
    console.error("list music error", error);
    return res.status(500).json({ message: "Unable to fetch music" });
  }
}

module.exports = {
  createMusic,
  getMusic,
};