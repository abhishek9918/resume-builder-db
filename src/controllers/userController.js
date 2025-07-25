require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const app = express();
const jwtkey =
  process.env.JWT_KEY || "Aj1NcGsHnYP7a0xEVkpR1u3ka9x9Kv9J4xZKDFqwT+M=";
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log(client);

const createOrUpdateUser = async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }

    let user;

    if (_id) {
      user = await User.findOneAndUpdate(
        { _id },
        { name, email, password },
        { new: true }
      );

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found for update!",
        });
      }
    } else {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).send({
          success: false,
          message: "User already exists with this email!",
        });
      }

      user = new User({ name, email, password });
      await user.save();
    }

    return res.status(200).send({
      success: true,
      message: _id
        ? "User updated successfully 🔁"
        : "User created successfully ✅",
      data: user,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Server error ❌",
      error: err.message,
    });
  }
};

const logIn = async (req, resp) => {
  console.log(">>>>logIn called with body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).send({
        success: false,
        message: "Email and password are required!",
      });
    }
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return resp.status(404).send({
        success: false,
        message: "Invalid email or password!",
      });
    }
    const payload = { userId: user._id, email: user.email };

    jwt.sign(payload, jwtkey, { expiresIn: "1h" }, (err, token) => {
      if (err)
        return resp
          .status(500)
          .json({ success: false, message: "Token error", error: err });

      resp.status(200).send({
        success: true,
        message: "User logged in successfully ✅",
        token,
        data: {
          name: user.name,

          email: user.email,
          reg_time: user.reg_time,
        },
      });
    });
  } catch (error) {
    return resp.status(501).send({
      success: false,
      message: "Internal server error ❌",
      error: error,
    });
  }
};

const isUserLoggedIn = async (req, res) => {
  try {
    // console.log(">>>>isUserLoggedIn called with user:", req.user, req);
    if (!req.user) {
      return res.status(401).json({
        isUserLoggedIn: false,
        message: "User is not logged in ❌",
      });
    }
    const userId = req.user.userId || req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        isUserLoggedIn: false,
        message: "User not found ❌",
      });
    }

    return res.status(200).json({
      isUserLoggedIn: true,
      message: "User is logged in ✅",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      isUserLoggedIn: false,
      message: "Server error ❌",
    });
  }
};

googleLogin = async (req, res) => {
  // console.log(">>>>googleLogin called with body:", req.body);

  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "ID token missing" });

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name });
    }

    const token = jwt.sign({ id: user._id }, jwtkey, {
      expiresIn: "30sec",
    });

    res.json({
      token,
      data: user,
      message: "Google login successful",
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed", error });
  }
};
module.exports = { createOrUpdateUser, logIn, isUserLoggedIn, googleLogin };
