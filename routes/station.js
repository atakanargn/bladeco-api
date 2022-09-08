var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const Station = require('../models/station');
const Card = require('../models/card');
const User = require('../models/user');

const verify =  (req, res, next) => {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.token;

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        try {
            const decoded = jwt.verify(token, 'BL4D3C0');
            req.user = decoded;
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
        return next();
}

// Şarj işlemi başlatma
router.post('/auth', async (req, res) => {
    try {
        const payload = req.body;

        try {
            var station = await Station.findOne({ code: payload.station });
            if (station == null) {
                res.send({ status: false, message: "Böyle bir istasyon yok!" })
                return
            }
        } catch (err) {
            res.send({ status: false, message: "Böyle bir istasyon yok!" })
            return
        }

        if (station.inprogress == 1) {
            res.send({ status: false, message: "Bu istasyon kullanımda!" })
            return
        }

        if (payload.method == 0) {
            var card = await Card.findOne({ uuid: payload.code });
            if (card == null) {
                res.send({ status: false, message: "Böyle bir üyelik kartı yok!" })
                return
            }

            try {
                var user = await User.findById(card.user);
            } catch (err) {
                res.send({ status: false, message: "Böyle bir kullanıcı yok!" })
                return
            }
        } else if (payload.method == 1) {
            try {
                var user = await User.findById(payload.code);
            } catch (err) {
                res.send({ status: false, message: "Böyle bir kullanıcı yok!" })
                return
            }
        } else if (payload.method == 2) {
            try {
                var user = await User.findOne({ phone: payload.code });
            } catch (err) {
                res.send({ status: false, message: "Böyle bir kullanıcı yok!" })
                return
            }
        } else {
            res.status(400).json({ message: 'There is no such method!' })
            return
        }

        if (user.status != 1) {
            res.send({ status: false, message: "Kullanıcı şarj kuyruğunda değil!" })
            return
        }

        await Station.findByIdAndUpdate(
            station._id, {
            inprogress: 1,
            user: user._id,
            charge_start_date: new Date(),
            watt: 0
        }, {
            new: true
        });

        await User.findByIdAndUpdate(
            user._id, {
            status: 2
        }, {
            new: true
        });

        var station = await Station.findOne({ code: payload.station });

        if (station.inprogress == 1 && station.user == user._id) {
            res.send({ status: true, message: "Şarj işlemi başarıyla başlatıldı." })
        } else {
            res.send({ status: false, message: "Şarj işlemi başlatılırken, bilinmeyen bir hata oluştu." })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

router.post('/update', async (req, res) => {
    try {
        const payload = req.body;

        try {
            var station = await Station.findOne({ station: payload.station });
            if (station == null) {
                res.send({ status: false, message: "Böyle bir istasyon yok!" })
                return
            }
        } catch (err) {
            res.send({ status: false, message: "Böyle bir istasyon yok!" })
            return
        }

        await Station.findByIdAndUpdate(
            station._id, {
            watt: station.watt + payload.watt
        }, {
            new: true
        });

        res.send({ status: true, message: "Watt eklendi." })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

// Şarj işlemi durdurma
router.post('/auth/d', async (req, res) => {
    try {
        const payload = req.body;

        if (payload.method == 0) {
            var card = await Card.findOne({ uuid: payload.code });
            if (card == null) {
                res.send({ status: false, message: "Böyle bir üyelik kartı yok!" })
                return
            }

            try {
                var user = await User.findById(card.user);
            } catch (err) {
                res.send({ status: false, message: "Böyle bir kullanıcı yok!" })
                return
            }
        } else if (payload.method == 1) {
            try {
                var user = await User.findById(payload.code);
            } catch (err) {
                res.send({ status: false, message: "Böyle bir kullanıcı yok!" })
                return
            }
        } else if (payload.method == 2) {
            try {
                var user = await User.findOne({ phone: payload.code });
            } catch (err) {
                res.send({ status: false, message: "Böyle bir kullanıcı yok!" })
                return
            }
        } else {
            res.status(400).json({ message: 'There is no such method!' })
            return
        }

        var station = await Station.findOne({ code: payload.station, user: user._id, inprogress: 1 });

        if (station != undefined) {
            await Station.findByIdAndUpdate(
                station._id, {
                inprogress: 0,
                user: ""
            }, {
                new: true
            });

            await User.findByIdAndUpdate(
                user._id, {
                status: 0
            }, {
                new: true
            });

            var station = await Station.findOne({ code: payload.station });

            if (station.inprogress == 0 && station.user == "") {
                res.send({ status: true, message: "Şarj işlemi başarıyla durduruldu." })
            } else {
                res.send({ status: false, message: "Şarj işlemi durdurulamadı, bilinmeyen bir hata oluştu." })
            }
        } else {
            res.send({ status: false, message: "Böyle bir işlem yok!" })
        }



    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/progress/:id', async (req, res) => {
    try {
        var station = await Station.findOne({ user: req.params.id });
        if (station != null) {
            res.send(station)
        } else {
            station = await Station.findOne({ code: req.params.id });
            if (station != null) {
                res.send(station)
            } else {
                res.send({ message: "Böyle bir işlem yok!" })
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get station by name
router.get('/search/:name', async function (req, res, next) {
    try {
        const data = await Station.find({ name: { $regex: '.*' + decodeURI(req.params.name) + '.*' } });
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// Get station by id
router.get('/:id', verify, async function (req, res, next) {
    try {

        // Izin seviyesi
        if(req.user.permissions<11){
            res.status(400).send({
                message: "You do not have permission to access this station"
            })
            return
        }

        const data = await Station.findById(req.params.id);
        if (data == null) {
            res.status(404).json({ status: false, message: 'Station not found' });
        } else {
            res.status(200).json(data)
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/', async function (req, res, next) {
    try {
        const data = await Station.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/', async function (req, res, next) {
    try {
        var payload = req.body;

        const stations = new Station(payload);

        const dataToSave = await stations.save();
        res.status(200).json(dataToSave)
        return
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message });
        return
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Station.findByIdAndDelete(id)
        res.status(200).send({ status: true })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
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

        if (result == null) {
            res.status(404).json({ status: false, message: 'Station not found' });
        } else {
            res.send(result)
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;
