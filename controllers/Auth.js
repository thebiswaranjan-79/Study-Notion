const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // check if user already exist or not

    const chechUserPresent = await User.findOne({ email });

    // If user already exist, then return a response
    if (chechUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // Generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP Generated : ", otp);

    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an Entry for OTP  in DB
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return response successfully

    res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Sign UP

exports.signUp = async function (req, res) {
  try {
    // data fetch from request ki Body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Validate Krlo
    // Check if any field is missing or empty
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2 password match karlo

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do Not Match ",
      });
    }
    // check user exist or not

    const existningUser = await User.findOne({ email });
    if (existningUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
    }

    // find the most recent OTP stored for the user
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOTP);
    // validate OTP
    if (recentOTP.length == 0) {
      // OTP not FOund
      return res.status(404).json({
        success: false,
        message: "OTP NOT Found ",
      });
    } else if (otp != recentOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Entry Create in DB

    const profileDetails = await Profile.create({
      gender: null,
      dateofBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword, // Ensure to hash this password before saving to DB
      accountType: accountType,
      contactNumber: contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebar.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "User is registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User can't be Registered ",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check karlo konsa empty hai ki nhi
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check user exist or Not
    const user = User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is Not Registered.. Please SignUp",
      });
    }

    // generate JWT, after password Matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      // create cookies and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully ",
      });
    } else {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Password is inCorrect...!!!!!!!!!!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User  Login Failed ",
    });
  }
};

// Change Password
exports.changePassword = async(req, res) => {
  // get data from req ki body 
  // get oldPassword, newPassword, confirmPassword
  // Validation
  

  // Update password in Database 
  // Send mail - Password Updated
  // return response

}


