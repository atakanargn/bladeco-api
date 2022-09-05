var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const verify =  (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.token;

    if (!token) {
        return res.render('admin/login')
    }
    try {
        const decoded = jwt.verify(token, 'BL4D3C0');
        console.log(decoded)
        req.user = decoded;
    } catch (err) {
        console.log(err)
        return res.render('admin/login')
    }
    return next();
}

router.get('/', verify, async function (req, res, next) {
        res.render('admin/index')
})

module.exports = router;