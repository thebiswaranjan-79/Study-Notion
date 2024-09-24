const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require('otp-generator');

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
            upperCaseAlphabets : false,
            lowerCaseAlphabets: false,
            specialChars : false,
        });

        console.log("OTP Generated : ", otp);

        // check unique otp or not 
        const result = await OTP.findOne({otp : otp});

        while(result){
            otp = otpGenerator(6, {
                upperCaseAlphabets : false,
                lowerCaseAlphabets: false,
                specialChars : false,
            });
            result = await OTP.findOne({otp : otp});
        }

        const otpPayload = {email, otp};

        // create an Entry for OTP  in DB 
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return response successfully 

        res.status(200).json({
            success : true,
            message : "OTP Send Successfully",
            otp,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
            
        })
    }
};
// Sign UP

exports.signUp = async function(req, res)  {
    // data fetch from request ki Body 
    // Validate Krlo 
    // 2 password match karlo 
    // check user exist or not 
    

    // find the most recent OTP stored for the user 
    // validate OTP 

    // Hash password
    // Entry Create in DB 

    // Return result 
}



// Login

// Change Password
