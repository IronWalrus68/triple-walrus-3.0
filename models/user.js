const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    },
    email: {
        type: String,
        required: [true, 'Email cannot be blank']
    },
    tokenValue: {
        type: Number,
        default: 100
    },
    lastWin: {
        type: Number,
        default: 0
    },
    totalWinnins: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema);