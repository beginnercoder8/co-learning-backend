const mongoose = require('mongoose');

const ForgotPasswordOtp = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    otp: {
        type: String,
        required: true
    },
    expiryTime: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('forgotpasswordotpdetails', ForgotPasswordOtp) 