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

router.get('/istasyonlar', verify, async function (req, res, next) {
    res.render('admin/istasyonlar')
})

router.get('/modeller', verify, async function (req, res, next) {
    res.render('admin/modeller')
})

router.get('/cihazlar', verify, async function (req, res, next) {
    res.render('admin/cihazlar')
})

router.get('/kartlar', verify, async function (req, res, next) {
    res.render('admin/kartlar')
})

router.get('/sys_users', verify, async function (req, res, next) {
    res.render('admin/sys_users')
})

router.get('/users', verify, async function (req, res, next) {
    res.render('admin/users')
})

router.get('/logout', verify, async function (req, res, next) {
    res.clearCookie('token')
    res.render('admin/login')
    return res.end()
})

module.exports = router;