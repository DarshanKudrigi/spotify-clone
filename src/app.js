require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");

const app = express();
connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);



module.exports = app;