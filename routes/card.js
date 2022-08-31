var express = require('express');
var router = express.Router();

const Card = require('../models/card');

// Get card by uuid
router.get('/:uuid', async function(req, res, next) {
    try{
        const data = await Card.find({uuid:req.params.uuid});
        if(data==null){
            res.status(404).json({status:false, message: 'Card not found'});
        }else{
            if(data[0]=="" ||data[0]==null || data[0]==undefined){
                res.status(404).json({status:false, message: 'Card not found'})
            }else{
                res.status(200).json(data[0])
            }
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.get('/', async function(req, res, next) {
    try{
        const data = await Card.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/', async function(req, res, next) {
    try{
        var payload = req.body;

        const cards = new Card(payload);

        const dataToSave = await cards.save();
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
        const data = await Card.findByIdAndDelete(id)
        res.status(200).send({status:true})
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

        const result = await Card.findByIdAndUpdate(
            id, updatedData, options
        )

        if(result==null){
            res.status(404).json({status:false, message: 'Card not found'});
        }else{
            res.send(result)
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



module.exports = router;
