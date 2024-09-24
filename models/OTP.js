const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL index to expire documents after 5 minutes (300 seconds)
  },
});

// a function to send Mails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otp
    );
    console.log("Email Sent Successfully : ", mailResponse);
  } catch (error) {
    console.log("Error Occured While Sending Mails", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
