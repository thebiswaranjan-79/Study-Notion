const User = require("../models/User");
const mailSender = require("../utils/mailSender");

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

exports.resetPasswordToken = async (req, res) =>{
    // data fetch 
    // validation 
    // get userDetails from db using token
    // if no entry - invalid token 
    // token time check 
    // hash password 
    // password update 
    
}
