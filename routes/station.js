var express = require('express');
var router = express.Router();

const Station = require('../models/station');

const sifirEkle = (input,count)=>{
    var output = input
    while(output.length<count){
        output = '0'+output;
    }
    return output
}

// Get card by uuid
router.get('/:id', async function(req, res, next) {
    try{
        const data = await Station.findById(req.params.id);
        console.log(data);
        if(data==null){
            res.status(404).json({message: 'Station not found'});
        }else{
            if(data=="" ||data==null || data==undefined){
                res.status(404).json({message: 'Station not found'})
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
        const data = await Station.find();

        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/', async function(req, res, next) {
    try{
        var payload    = req.body;
        var station_count    = await Station.countDocuments()+1;
        payload.code   = "BPS-32-"+sifirEkle(station_count.toString(),8)
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
        const data = await Station.findById(req.params.id);
        console.log(data)
        if(data==null){
            res.status(404).json({message: 'Station not found'});
        }else{
            if(data=="" ||data==null || data==undefined){
                res.status(404).json({message: 'Station not found'})
            }else{
                await Station.findByIdAndDelete(req.params.id)
                res.status(200).send({message:'Station deleted.'})
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