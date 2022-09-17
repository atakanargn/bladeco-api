var express = require('express');
var router = express.Router();
const twilio = require('twilio');
const User = require('../models/user');

const accountSid = 'AC39356ff9384011185609a9e39f96f495'; // Your Account SID from www.twilio.com/console
const authToken = 'a46cb47f47a6c7ab6658b6e678de468a'; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

var verifications = {}

function smsGonder(phone,message){
    client.messages
        .create({
            body: message,
            to: phone,
            from: '+15734643545',
        })
        .then(() => console.log("Success"));
}

// Get users
router.get('/', async function(req, res, next) {
    try{
        const data = await User.find();
        if(data==null){
            res.status(404).json({status:false, message: 'Card not found'});
        }else{
            res.status(200).json(data)
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.get('/p/:phone', async function(req, res, next) {
    try{
        const data = await User.findOne({phone:req.params.phone});
        await User.findByIdAndUpdate(
            data._id, {
                status:1
            },{
                new:true
            });
        if(data==null){
            res.status(404).json({status:false, message: 'User not found'});
        }else{
            res.status(200).json(data)
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

// Get user by id
router.get('/:id', async function(req, res, next) {
    try{
        const data = await User.find({id:req.params.id});
        if(data==null){
            res.status(404).json({status:false, message: 'User not found'});
        }else{
            res.status(200).json(data)
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/', async function(req, res, next) {
    try{
        var payload = req.body;

        var code = Math.floor(100000 + Math.random() * 900000)

        verifications[payload.phone] = {code:code,payload:payload}

        smsGonder(payload.phone,'BladeCo Giriş Kodunuz : '+verifications[payload.phone].code)
        console.log(code)
        res.status(200).json({status:true,message:"Doğrulama kodu telefonunuza gönderildi."})
        return
    }catch(err){
        console.log(err);
        res.status(200).send({status:false,message:'Doğrulama kodu gönderilirken bir hata oluştu.',error:err.message});
        return
    }
})

router.post('/verify', async function(req, res, next) {
    try{
        var payload = req.body;

        if(Object.keys(verifications).includes(payload.phone)){
            if(verifications[payload.phone].code == payload.code){
                var userControl = await User.find({phone:payload.phone});
                if(userControl.length>0){
                    userControl[0].registered = true
                    res.status(200).send(userControl[0])
                }else{
                    verifications[payload.phone].payload.registered = false
                    var users = new User(verifications[payload.phone].payload);
                    const dataToSave = await users.save();
                    res.status(200).json(dataToSave)
                }
                
                
            }else{
                console.log(verifications[payload.phone])
                res.status(404).send({message:'Gönderilen kodu hatalı girdiniz!'})
            }
        }else{
            res.status(404).send({message:'Böyle bir doğrulama yok!'})
        }
    }catch(err){
        console.log(err);
        res.status(400).send({message: err.message});
        return
    }
})



module.exports = router;