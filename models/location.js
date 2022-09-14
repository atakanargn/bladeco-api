const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    address:{
        required:true,
        type:String
    },
    latitude:{
        required:true,
        type:Number,
        default:0
    },
    longitude:{
        required:true,
        type:Number,
        default:0
    },
    notes:{
        required:false,
        type:String,
        default:""
    },
    online:{
        required:false,
        type:Boolean,
        default:false
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Location', dataScheme)