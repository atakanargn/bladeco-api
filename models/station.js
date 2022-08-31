const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    code: {
        required: true,
        type: String
    },
    name: {
        required: false,
        type: String,
    },
    type: {
        required: false,
        type: String,
        default: 0
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
    service_status: {
        required: false,
        type: Boolean,
        default: false
    },
    network_status: {
        required: false,
        type: Boolean,
        default: false
    },
    temperature: {
        required: false,
        type: Number,
        default: 0
    },
    inprogress: {
        required: false,
        type: Number,
        default: 0
    },
    user: {
        required: false,
        type: String,
        default: ""
    },
    watt:{
        required: false,
        type: Number,
        default: 0.0
    },
    charge_start_date: { required: false, type: Date },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Station', dataScheme)