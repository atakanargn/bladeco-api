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
        type:String
    },
    model: {
        required: false,
        type: Number
    },
    service_status:{
        required:false,
        type:Number
    },
    network_status:{
        required:false,
        type:Boolean
    },
    relay_0:{
        required:false,
        type:Number
    },
    relay_1:{
        required:false,
        type:Number
    },
    relay_2:{
        required:false,
        type:Number
    },
    charge_start_date:{
        required:false,
        type:Date
    },
    last_user:{
        required:false,
        type:String
    },
    inprogress:{
        required:false,
        type:Number,
        default:0
    },
    watt:{
        required:false,
        type:Number,
        default:0
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Device', dataScheme)