const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth

exports.auth = async (req, res, next) => {
  try {
    // Extract Token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    // If token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is Missing",
      });
    }

    // Verify the Token using secret key
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      // issue verification
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something is wrong while validating the TOKEN",
    });
  }
};

// Student

exports.isStudent = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role Can't be Verified",
    });
  }
};

//Instructor

// Admin
