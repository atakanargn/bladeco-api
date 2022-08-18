const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    code:{
        required:true,
        type:String
    },
    name: {
        required: false,
        type: String,
    },
    type: {
        required:false,
        type:String,
        default:0
    },
    lat: {
        required: false,
        type: Number
    },
    lon: {
        required: false,
        type: Number
    },
    address:{
        required:false,
        type:String,
        default:""
    },
    service_status:{
        required:false,
        type:Boolean,
        default:false
    },
    network_status:{
        required:false,
        type:Boolean,
        default:false
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Station', dataScheme)