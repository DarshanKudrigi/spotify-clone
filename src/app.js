require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to the Spotify API");
});


app.use(express.json());

app.use("/api/auth", userRoutes);

app.use("/api/auth/login", userRoutes);

app.use("/api/music", musicRoutes);



module.exports = app;