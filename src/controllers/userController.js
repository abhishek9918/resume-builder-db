const User = require("../models/userSchema");
const mongoose = require("mongoose");
const express = require("express");
// const ObjectId = mongodb.ObjectId;

const signUp = async (req, resp) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return resp.status(400).send({
        success: false,
        message: "Name, email, and password are required!",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return resp.status(409).send({
        success: false,
        message: "User already exists with this email!",
      });
    }

    const user = new User({ name, email, password });
    const result = await user.save();

    const data = {
      name: result.name,
      email: result.email,
      password: result.password,
    };

    return resp.status(201).send({
      success: true,
      message: "User created successfully 🎉",
      data: data,
    });
  } catch (error) {
    return resp.status(501).send({
      success: false,
      message: "Internal server error ❌ !",
      error: error.message,
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

    return resp.status(200).send({
      success: true,
      message: "User logged in successfully ✅",
      data: loginUser,
    });
  } catch (error) {
    return resp.status(501).send({
      success: false,
      message: "Internal rerver rrror",
      error: error,
    });
  }
};

module.exports = { signUp, logIn };
