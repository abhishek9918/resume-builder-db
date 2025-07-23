require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const app = express();
const jwtkey =
  process.env.JWT_KEY || "Aj1NcGsHnYP7a0xEVkpR1u3ka9x9Kv9J4xZKDFqwT+M=";
console.log(">>>>JWT_KEY:", process.env.JWT_KEY);

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
    user.lastLogin = new Date();
    user.isUserLoggedIn = true;
    await user.save();

    const loginUser = {
      name: user.name,
      email: user.email,
      isUserLoggedIn: true,
    };

    jwt.sign(
      { userId: user._id, email: user.email },
      jwtkey,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return resp.status(500).send({
            success: false,
            message: "Error generating token",
            error: err.message,
          });
        }
        resp.status(200).send({
          success: true,
          message: "User logged in successfully ✅",
          token,
          data: loginUser,
        });
      }
    );
  } catch (error) {
    return resp.status(501).send({
      success: false,
      message: "Internal server error ❌",
      error: error,
    });
  }
};

const isUserLoggedIn = async (req, res) => {
  console.log(req.user, "User is logged in");
  if (req.user) {
    console.log(req.user, "User is logged in");
    return res.status(200).json({
      isUserLoggedIn: true,
      message: "User is logged in ✅",
      user: req.user,
    });
  } else {
    return res.status(401).json({
      isUserLoggedIn: false,
      message: "User is not logged in ❌",
    });
  }
};

module.exports = { createOrUpdateUser, logIn, isUserLoggedIn };
