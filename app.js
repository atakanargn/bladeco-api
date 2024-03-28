var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
var mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
var mssql = require("mssql");

const mongoString = "mongodb+srv://admin:90+90=180@blackpoint.sojqld1.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

// Import routers
var indexRouter      = require('./routes/index');
var locationRouter   = require('./routes/location');
var stationRouter    = require('./routes/station');
var rateRouter       = require('./routes/rate');
var userRouter       = require('./routes/user');
var cardRouter       = require('./routes/card');
var systemUserRouter = require('./routes/system_user');
var adminRouter      = require('./routes/admin');


const { render } = require('ejs');

function count(str, find) {
  return (str.split(find)).length - 1;
}

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

app.post('/api/v1/query', async (req, res, next) => {
  var config = {
    user: 'sa',
    password: 'Doksan+90=180',
    server: '127.0.0.1',
    database: 'blackpoint',
    trustServerCertificate: true
  };

  var payload = req.body;
  var query;
  var queryType;
  var sqlq = `select * from query where q_type=${payload.tip};`

  try {
    mssql.connect(config, function (err) {
      console.log("MsSQL Connected!")
      var queryRequest = new mssql.Request();
      queryRequest.query(sqlq, function (err, recordset) {
        if (err) {
          sonData = { code: 400, 'data': err.message }
          res.status(sonData.code).json({ status:false, data: sonData.data })
          return
        }
        try {
          query = recordset.recordset[0].q_query.toString();
        } catch (err) {
          sonData = { code: 404, data: 'There is no such query!' }
          res.status(sonData.code).json({ status:false, data: sonData.data })
          return
        }
        
        try{
          Object.keys(payload.data).forEach(function (key) {
            var sayac = count(query, `--${key}--`);
            for (var i = 0; i < sayac; i++) {
              query = query.replace(`--${key}--`, payload.data[key])
            }
          });
        }catch(err){

        }
        

        var request = new mssql.Request();
        request.query(query, function (err, recordset) {
          if (err) {
            sonData = { code: 400, 'data': err.message }
            res.status(sonData.code).json({ status:false, data: sonData.data })
            return
          }

          sonData = { code: 200, data: recordset.recordset, rowsAffected: recordset.rowsAffected[0] }
          res.status(sonData.code).json({ status:true, data: sonData.data })
          return
        });
      });
      if (err) console.log(err);
    });
  } catch (err) {
    res.status(400).json({ status:false, data: `Query error : ${err.message}` });
  }
});

// Setting routes
app.use('/api/v1', indexRouter);
app.use('/api/v1/location',locationRouter);
app.use('/api/v1/station/', stationRouter);
app.use('/api/v1/rate/', rateRouter);
app.use('/api/v1/user/', userRouter);
app.use('/api/v1/card/', cardRouter);
app.use('/api/v1/system_user/', systemUserRouter);


// Admin page
app.use('/admin/', adminRouter);

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
