const bcrypt = require('bcrypt');
const Users = require('../model/auth.model');
const jwt = require('jsonwebtoken');

const login = async(req, res) => {
    const { email, password } = req.body;
    try{
        if(email && password) {
            const signedInUser = await Users.findOne({email});
            if(!signedInUser) {
                return res.status(400).json({code:400, message: "Email id doesn't exist." })
            }
            const passwordMatched = await bcrypt.compare(password, signedInUser.password);
            if(!passwordMatched) {
                return res.status(400).json({code:400, message: "Password is incorrect." })
            }
            const user = {
                username: signedInUser.username,
                userId: signedInUser._id,
                email: signedInUser.email,
                role: signedInUser.role
            }
            const token = await jwt.sign(user,process.env.SECRET_KEY,{expiresIn:'30m'});
            return res.status(200).json({code:200, message: 'Successfully logged in.',token:token})  
        } else if(!email && !password) {
           return res.status(400).json({code:400, message:'Email id and password are required.'})
        } else if (!email || !password) {
            return res.status(400).json({code:400, message: !email ? 'Email id is missing.' : 'Password is missing.'})
        }
    } catch(err) {
        return res.status(400).json({code:400, message:err.message})
    }
};

const createAccount = async(req, res) => {
    const {username, email, password, role} = req.body;
    try {
        if(username && email && password && role) {
            const encyptedPassword = await bcrypt.hash(password, 10);
            const account = {
                username: username,
                email: email,
                password: encyptedPassword,
                role: role
            };
            await Users.create({...account});
            return res.status(201).json({code:200, message: 'Account created successfully'})
        } else {
            return res.status(400).json({code:400, message: 'Please provide all required fields',requiredFields: ['username','email','password','role']});
        }
    } catch(err) {
        return res.status(400).json({code:400, message:err.message})
    }
}

module.exports = { 
    createAccount,
    login
}