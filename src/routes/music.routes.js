const express = require("express");
const musicController = require("../controllers/music.controller");

const router = express.Router();


router.post("/add", musicController.addMusic);

module.exports = router;