const mongoose = require('mongoose');

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

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;


// from last 29min
