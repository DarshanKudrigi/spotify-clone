require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");


connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);

const app = express();


module.exports = app;