
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
const corsOptions = {
  origin: process.env.REACT_URL || 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'X-Requested-With,content-type',
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true, 
};
app.use(cors(corsOptions));

//khai bao thu vien moi
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: false }));
var fileupload = require('express-fileupload');
app.use(fileupload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add headers before the routes are defined
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// khai bao ung dung moi
//khai bao ung dung loaisp
var loaispRoute = require('./routes/loaisp');
app.use('/loaisp', loaispRoute);

//khai bao ung dung sanpham
var sanphamRoute = require('./routes/sanpham');
app.use('/sanpham',sanphamRoute);

//khai bao ung dung blog
var blogRoute = require('./routes/blog');
app.use('/blog',blogRoute);


//khai bao ung dung gioithieu
var gioithieuRoute = require('./routes/gioithieu');
app.use('/gioithieu',gioithieuRoute);

//khai bao ung dung nhacc
var nhaccRoute = require('./routes/nhacc');
app.use('/nhacc',nhaccRoute);

//khai bao ung dung hoadonban
var hoadonbanRoute = require('./routes/hoadonban');
app.use('/hoadonban',hoadonbanRoute);

//khai bao ung dung donhangnhap
var hoadonnhapRoute = require('./routes/hoadonnhap');
app.use('/hoadonnhap',hoadonnhapRoute);

//khai bao ung dung Chitiethdb
var chitiethdbRoute = require('./routes/chitiethdb');
app.use('/chitiethdb',chitiethdbRoute);

//khai bao ung dung chitiethdn
var chitiethdnRoute = require('./routes/chitiethdn');
app.use('/chitiethdn',chitiethdnRoute);

//khai bao ung dung khachhang
var khachhangRoute = require('./routes/khachhang');
app.use('/khachhang',khachhangRoute);

//khai bao ung dung nhanvien
var nhanvienRoute = require('./routes/nhanvien');
app.use('/nhanvien',nhanvienRoute);

//khai bao ung dung account
var accountRoute = require('./routes/account');
app.use('/account',accountRoute);

//khai bao ung dung vnpay
var paymentvnpRoute = require('./routes/paymentvnp');
app.use('/paymentvnp',paymentvnpRoute);

//khai bao jwt
var jwtroute = require('./middleware/jwt');
app.use('/middleware', jwtroute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status === 403) {
    res.json({ message: 'Access denied' });
  } else {
    res.render('error');
  }
});

module.exports = app;