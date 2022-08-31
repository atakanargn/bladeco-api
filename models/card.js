const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    uuid:{
        required:true,
        type:String
    },
    user:{
        required:false,
        type:String
    },
    status:{
        required:false,
        type:Number,
        default:0
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Card', dataScheme)