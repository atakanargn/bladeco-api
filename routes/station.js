var express = require('express');
var router = express.Router();

const Station = require('../models/station');

// Get station by name
router.get('/search/:name', async function(req, res, next) {
    try{
        console.log(decodeURI(req.params.name))
        const data = await Station.find({name:{ $regex: '.*' + decodeURI(req.params.name) + '.*' }});
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

// Get station by id
router.get('/:id', async function(req, res, next) {
    try{
        const data = await Station.findById(req.params.id);
        if(data==null){
            res.status(404).json({status:false, message: 'Station not found'});
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
        const data = await Station.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/', async function(req, res, next) {
    try{
        var payload = req.body;

        const stations = new Station(payload);

        const dataToSave = await stations.save();
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
        const data = await Station.findByIdAndDelete(id)
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

        const result = await Station.findByIdAndUpdate(
            id, updatedData, options
        )

        if(result==null){
            res.status(404).json({status:false, message: 'Station not found'});
        }else{
            res.send(result)
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;
