const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, changePassword } = require('../controller/otp.controller');
const { verifyJwtToken } = require('../controller/jwtToken.controller');

router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);
router.route('/change-password').post(verifyJwtToken, changePassword)
module.exports = router;