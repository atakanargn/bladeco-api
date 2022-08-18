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
    station: {
        required:false,
        type:String,
        default:0
    },
    model: {
        required: false,
        type: Number
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
    relay:{
        required:false,
        type:Boolean,
        default:0
    },
    socket_status:{
        required:false,
        type:Boolean,
        default:0
    },
    charge_start_date:{
        required:false,
        type:Date
    },
    last_user:{
        required:false,
        type:String
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Device', dataScheme)