var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SystemUser = require('../models/system_user');

// Get user by id
router.get('/:id', async function(req, res, next) {
    try{
        const data = await SystemUser.findById(req.params.id);
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

// Get users
router.get('/', async function(req, res, next) {
    try{
        const data = await SystemUser.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

// Create user
router.post('/', async function(req, res, next) {
    try{
        var payload = req.body;
        encryptedPassword = await bcrypt.hash(payload.password, 10);
        payload.password = encryptedPassword

        const token = jwt.sign(
            { user_id: password._id },
            "BL4D3C0",
            {
              expiresIn: "2h",
            }
          );

        payload.token = token;
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

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await SystemUser.findByIdAndDelete(id)
        res.status(200).send({status:true})
    }
    catch (error) {
        res.status(400).json({message: error.message })
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
