const usermodel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

async function registeruser(req, res) {
  const { username, email, password, role = "user" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email and password are required" });
  }

  try {
    const existingUser = await usermodel.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usermodel.create({ username, email, password: hashedPassword, role });

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("register error", error);
    return res.status(500).json({ message: "Unable to register user" });
  }
}

async function loginuser(req, res) {
  const { email, username, password } = req.body;

  if (!password || (!email && !username)) {
    return res.status(400).json({ message: "email or username and password are required" });
  }

  try {
    const user = await usermodel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login error", error);
    return res.status(500).json({ message: "Unable to log in" });
  }
}

async function logoutuser(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
}

async function getCurrentUser(req, res) {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { registeruser, loginuser, logoutuser, getCurrentUser };