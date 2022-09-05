var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const SystemUser = require('../models/system_user');

// Login user
router.post('/login', async function (req, res,next) {
    try{
        var payload = req.body;
        encryptedPassword = CryptoJS.MD5(payload.password).toString();

        const user = await SystemUser.findOne({password:encryptedPassword,phone:payload.phone});

        if(user!=null){
            const token = jwt.sign(
                { user_id: payload.phone, password:encryptedPassword,permissions:user.permissions},
                "BL4D3C0",
                {
                  expiresIn: "2h",
                }
              );
            res.cookie('token',token)
            res.send({status:true,message:"Kullanıcı girişi başarılı."})
        }else{
            res.status(200).send({status:false,message:"Kullanıcı adı ya da şifre yanlış!"})
        }
    }catch(err){

    }
})

// Create user
router.post('/', async function(req, res, next) {
    try{
        var payload = req.body;
        encryptedPassword = CryptoJS.MD5(payload.password).toString();
        payload.password = encryptedPassword

        const users = new SystemUser(payload);
        const dataToSave = await users.save();
        res.status(200).json(dataToSave)
        return
    }catch(err){
        console.log(err);
        res.status(400).send({message: err.message});
        return
    }
})

// Update user
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var updatedData = req.body;
        updatedData.updated_date = new Date()
        const options = { new: true };

        const result = await SystemUser.findByIdAndUpdate(
            id, updatedData, options
        )

        if(result==null){
            res.status(404).json({status:false, message: 'Device not found'});
        }else{
            res.send(result)
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;
