var express = require('express');
var router = express.Router();

const Location = require('../models/location');

// Get card by uuid
router.get('/:id', async function(req, res, next) {
    try{
        const data = await Location.findById(req.params.id);
        console.log(data);
        if(data==null){
            res.status(404).json({message: 'Location not found'});
        }else{
            if(data=="" ||data==null || data==undefined){
                res.status(404).json({message: 'Location not found'})
            }else{
                res.status(200).json({data:data})
            }
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.get('/', async function(req, res, next) {
    try{
        const data = await Location.find();

        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/', async function(req, res, next) {
    try{
        var payload = req.body;

        const locations = new Location(payload);

        const dataToSave = await locations.save();
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
        const data = await Location.findById(req.params.id);
        console.log(data)
        if(data==null){
            res.status(404).json({message: 'Location not found'});
        }else{
            if(data=="" ||data==null || data==undefined){
                res.status(404).json({message: 'Location not found'})
            }else{
                await Location.findByIdAndDelete(req.params.id)
                res.status(200).send({message:'Location deleted.'})
            }
        }
    }
    catch (error) {
        res.status(400).json({message: error.message })
    }
})

router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var updatedData = req.body;
        updatedData.updated_date = new Date()
        const options = { new: true };

        const result = await Location.findByIdAndUpdate(
            id, updatedData, options
        )

        if(result==null){
            res.status(404).json({status:false, message: 'Location not found'});
        }else{
            res.send(result)
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;