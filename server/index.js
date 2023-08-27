const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    return res.status(400).json({ error: "Authentication failed" });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    return res.status(400).json({ error: "Authentication failed" });
  }

  jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" }).json({
      id: userDoc._id,
      username,
      token,
    });
  });
});

const revokedTokens = new Set();

app.post("/logout", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    revokedTokens.add(token);
  }
  res.clearCookie("token").json("ok");
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  if (revokedTokens.has(token)) {
    return res.status(401).json({ message: "Token revoked" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json(info);
  });
});

mongoose.connect(process.env.DATABSE_URL).then(() => {
  console.log("listening on port 5000");
  app.listen(5000);
});
