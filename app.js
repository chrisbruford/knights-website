"use strict";
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let session = require('express-session');

//routes
let home = require('./routes/index');
let register = require('./routes/register');
let members = require('./routes/members');
let login = require('./routes/login');
let logout = require('./routes/logout');
let authcheck = require('./routes/authcheck');

let app = express();

app.locals.courses = require('./data/courses');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'anything'}));
app.use(passport.initialize());
app.use(passport.session());

//mongoose passport config

require('./db').then(mongoose => {
  mongoose.Promise = global.Promise;
  require('./models/user').then(User => {
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
  });
})


//allow CORS requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use('/', home);
app.use('/register', register);
app.use('/members', members);
app.use('/login', login);
app.use('/logout', logout);
app.use('/authcheck', authcheck);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = app;
