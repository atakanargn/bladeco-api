var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
var mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mongoString = "mongodb+srv://admin:Doksan+90=180@blackpoint.sojqld1.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

// Import routers
var indexRouter = require('./routes/index');
var stationRouter = require('./routes/station');
var deviceRouter = require('./routes/device');
var userRouter = require('./routes/user');
var cardRouter = require('./routes/card');
var systemUserRouter = require('./routes/system_user');

const { render } = require('ejs');

// Set express
var app = express();

// View engine is ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setting routes
app.use('/api/v1', indexRouter);
app.use('/api/v1/station/', stationRouter);
app.use('/api/v1/user/', userRouter);
app.use('/api/v1/device/', deviceRouter);
app.use('/api/v1/card/', cardRouter);
app.use('/api/v1/system_user/', systemUserRouter);

app.get('/', async function (req, res, next) {
  res.render('index')
})

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  res.status(err.status || 500);
  res.send(err.message);
});

var port = 3000
app.listen(process.env.PORT || port, () => console.log(`listening at http://localhost:${port}`));
