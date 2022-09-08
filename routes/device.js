var express = require('express');
var router = express.Router();

const Device = require('../models/device');

// Get device by name
router.get('/search/:name', async function(req, res, next) {
    try{
        const data = await Device.find({code:{ $regex: '.*' + decodeURI(req.params.name) + '.*' }});
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

// Get device by id
router.get('/:id', async function(req, res, next) {
    try{
        const data = await Device.findById(req.params.id);
        if(data==null){
            res.status(404).json({status:false, message: 'Device not found'});
        }else{
            res.status(200).json(data)
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.get('/', async function(req, res, next) {
    try{
        const data = await Device.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/', async function(req, res, next) {
    try{
        var payload = req.body;

        const devices = new Device(payload);

        const dataToSave = await devices.save();
        res.status(200).json(dataToSave)
        return
    }catch(err){
        console.log(err);
        res.status(400).send({message: err.message});
        return
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Device.findByIdAndDelete(id)
        res.status(200).send({status:true})
    }
    catch (error) {
        res.status(400).json({message: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var updatedData = req.body;
        updatedData.updated_date = new Date()
        const options = { new: true };

        const result = await Device.findByIdAndUpdate(
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
