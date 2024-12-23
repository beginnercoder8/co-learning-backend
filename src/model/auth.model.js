const mongoose = require('mongoose');

const Users = mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum:['student','lead','trainer'],
        default: 'student'
    }
})

module.exports = mongoose.model('Users',Users)