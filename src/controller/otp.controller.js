const Users = require("../model/auth.model");
const FpOtpDetails = require("../model/otp.model");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) return res.status(400).json({ code: 400, message: "Email id is required." });
        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ code: 400, message: "Email id doesn't exist. Please Login." });
        let otp = generateOTP(6);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GID,
                pass: process.env.GPASS,
            },
        });
        const mailOptions = {
            from: process.env.GID,
            to: email,
            subject: "Verification OTP",
            text: `Hi ${user.username}, Your verification otp for changing your password is ${otp}. Thank you.`,
        };
        await transporter.sendMail(mailOptions, async (err, info) => {
            if (err) return res.status(400).json({ code: 400, message: err.message });
            if (info) {
                const detailsAlreadyExists = await FpOtpDetails.findOne({ email });
                if (!detailsAlreadyExists) {
                    await FpOtpDetails.create({
                        email: email,
                        otp: otp,
                        expiryTime: Date.now() + 2 * 60 * 1000,
                    });
                } else {
                    await FpOtpDetails.findByIdAndUpdate(
                        detailsAlreadyExists._id,
                        { otp: otp, expiryTime: Date.now() + 2 * 60 * 1000 },
                        { new: true }
                    );
                }
                res.status(200).json({ code: 200, message: "OTP was sent successfully" });
            }
        });
    } catch (err) {
        res.status(400).json({ code: 400, message: err.message });
    }
};

const verifyOtp = async(req, res) => {
    const {otp, email} = req.body;
    try {
        if(!otp && !email) return res.status(400).json({code:400, message: 'Email id and OTP are required'})
        if(!otp || !email) return res.status(400).json({code:400, message: !otp ? 'OTP is required' : 'Email id is required'})
        const user = await FpOtpDetails.findOne({email});
        if(user.otp != otp) return res.status(400).json({code:400, message: 'Invalid OTP'})
        if(user.expiryTime < Date.now()) return res.status(400).json({code:400, message: 'OTP was expired'});
        if(user.otp === otp) {
            let resetToken = await jwt.sign({userEmailId: user.email}, process.env.SECRET_KEY, {expiresIn: '5m'});
            return res.status(200).json({code:200, message: 'OTP was verified Successfully', token: resetToken})
        }
    } catch(err) {
        res.status(400).json({code:400, message: err.message})
    }
}

const generateOTP = (length) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

const changePassword = async(req, res) => {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const email = req.user.userEmailId
    const user = await Users.findOne({email})
    await Users.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });
    res.status(200).json({code: 200, message: 'Password was changed successfully'})
}

module.exports = {
    sendOtp,
    verifyOtp,
    changePassword
};
