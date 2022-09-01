const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    name: {
        required: false,
        type: String,
    },
    lat: {
        required: false,
        type: Number
    },
    lon: {
        required: false,
        type: Number
    },
    address: {
        required: false,
        type: String,
        default: ""
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Station', dataScheme)