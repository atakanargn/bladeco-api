const mongoose = require('mongoose');

const dataScheme = new mongoose.Schema({
    code:{
        required:false,
        type:String
    },
    location:{
        required:true,
        type:String
    },
    socket:{
        required:true,
        type:["Mixed"]
    },
    online:{
        required:false,
        type:Boolean,
        default:false
    },
    isPublic:{
        required:false,
        type:Boolean,
        default:true
    },
    firmware_version:{
        required:false,
        type:String,
        default:"0"
    },
    notes:{
        required:false,
        type:String
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Station', dataScheme)