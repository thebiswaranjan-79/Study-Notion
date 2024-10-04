const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// ResetPassword Token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;
    // check user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your Email is Not Registered With Us",
      });
    }
    // generate token
    const token = crypto.randomUUID();
    // update user by adding token and expires time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    // return response

    const url = `http://localhost:3000/update-password/${token}`;
    // send mail contacting the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    // return Response
    return res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check email and Change Password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went Wrong while Reseting Password",
    });
  }
};

// resetPassword DB

exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.status(500).json({
        success: false,
        message: "Password Not Matching",
      });
    }
    // get userDetails from db using token
    const userDetails = await User.findOne({ token: token });
    // if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    // token time check
    if (userDetails.resetPasswordExpires > Date.now()) {
      return res.json({
        success: false,
        message: " Token is Expired, please regenerate your token",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // password update

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset Successfull",
    });
  } catch (error) {
    return res.status(401).json({
        success: false,
        message: "Password reset FAILED",
      });
  }
};


