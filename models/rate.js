const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    description:{
        required:false,
        type:String,
        default:""
    },
    isActive:{
        required:false,
        type:Boolean,
        default:false
    },
    type:{
        required:true,
        type:String
    },
    fee:{
        required:true,
        type:Number
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Rate', dataScheme)