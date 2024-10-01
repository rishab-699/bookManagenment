const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    "user_name": {
        type: String,
        required: true
    },
    "email":{
        type: String,
        required: true,
        unique: true
    },
    "userId":{
        type: String,
        required: true,
        unique: true
    },
    "phno":{
        type: String,
    }
})

module.exports = mongoose.models.user || mongoose.model('user', userSchema);