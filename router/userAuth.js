import express from "express";
import User from "../models/user.model.js";
import {
  authenticationToken,
  generateAccessToken,
  hashPassword,
} from "../utilities.js";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    if (!email) {
      return res.json({ error: true, message: "Email is required" });
    }
    if (!name) {
      return res.json({ error: true, message: "Name is required" });
    }
    if (!password) {
      return res.json({ error: true, message: "Password is required" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.json({ error: true, message: "User Already Exists" });
    }
    const passwordHash = await hashPassword(password);
    const newUser = new User({
      email: email,
      name: name,
      password: passwordHash,
    });
    await newUser.save();
    const token = generateAccessToken({ email: email, userId: newUser._id });
    res.status(201).json({ error: false, token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ error: true, message: "User Not Found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ error: true, message: "Invalid Password" });
    }
    const token = generateAccessToken({ email: email, userId: user._id });
    res.status(200).json({ error: false, token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/get-user", authenticationToken, async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.user.email },
      { password: 0, __v: 0 }
    );
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    return res.status(200).json({ error: false, user: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
