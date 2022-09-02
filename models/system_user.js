const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    fullname: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: Number
    },
    phone:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String
    },
    permissions: {
        required: false,
        type: String
    },
    unvan:{
        required: false,
        type: String
    },
    token:{
        required: false,
        type: String
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Station', dataScheme)