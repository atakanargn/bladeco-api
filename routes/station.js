var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
  
const db = admin.firestore();


router.get('/:id', async function(req, res, next) {
    try{
        const stations = db.collection('stations').doc(req.params.id);
        var data = []
        const doc = await stations.get();
        if (!doc.exists) {
            res.status(404).send({"message":"No such station!"})
        } else {
            res.send(doc.data())
        }
        return
    }catch(err){
        console.log(err);
        res.status(400).send({message: err.toString()});
        return
    }
});

router.get('/', async function(req, res, next) {
    try{
        const stations = await db.collection('stations').get();
        var data = []
        stations.forEach((doc) => {
            data.push(doc.data())
        });
        res.send(data)
        return
    }catch(err){
        console.log(err);
        res.status(400).send({message: err.toString()});
        return
    }
});

router.post('/', async function(req, res, next) {
    try{
        var payload = req.body
        
        const stations = await db.collection('stations').get();
        var data = []
        var cnt=0;
        var error=false;
        var message = ""
        stations.forEach((doc) => {
            if(doc.data().name==payload.name){
                message = message + 'Bu isimde bir istasyon daha önce eklenmiş.'
                error=true;
            }
            cnt++;
        });

        if(error){
            res.status(400).send({message:message})
            return
        }

        const stationRef = db.collection('stations').doc((cnt+1).toString());
        await stationRef.set({
            id:cnt+1,
            name: payload.name,
            lat: payload.lat,
            lon:payload.lon
        });

        res.send(payload)
        return
    }catch(err){
        console.log(err);
        res.status(400).send({message: err.toString()});
        return
    }
})

router.delete('/:id', async(req, res) => {
    try{
        const stations = db.collection('stations').doc(req.params.id);
        var data = []
        const doc = await stations.get();
        if (!doc.exists) {
            res.status(404).send({"message":"No such station!"})
        } else {
            var data = doc.data()
            const delete_req = await db.collection('stations').doc(req.params.id).delete();
            data.deleted=true
            res.send(data)
        }
        
        return
    }catch(err){
        console.log(err)
        res.status(400).send({message: err.toString()})
        return
    }
})

router.put('/:id', async function(req, res, next) {
    try{
        var payload = req.body
        
        const stations = db.collection('stations').doc(req.params.id);
        var data = []
        const doc = await stations.get();
        if (!doc.exists) {
            res.status(404).send({"message":"No such station!"})
            return
        }

        var data = []
        var cnt=0;
        var error=false;
        var message = ""

        if(error){
            res.status(400).send({message:message})
            return
        }

        const stationRef = db.collection('stations').doc(req.params.id);
        await stationRef.set(req.body);

        res.send(payload)
        return
    }catch(err){
        console.log(err);
        res.status(400).send({message: err.toString()});
        return
    }
})

module.exports = router;
