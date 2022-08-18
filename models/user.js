const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    fullname:{
        required:false,
        type:String,
        default:""
    },
    phone:{
        required:true,
        type:String
    },
    status:{
        required:false,
        type:Number,
        default:1
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', dataScheme)