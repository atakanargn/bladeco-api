var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');
const fs = require('fs')
var mongoose = require('mongoose');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});


// Import routers
var indexRouter = require('./routes/index');
var stationRouter = require('./routes/station');

// Set express
var app = express();

// View engine is ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setting routes
app.use('/api/', indexRouter);
app.use('/api/station/',stationRouter);



app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;