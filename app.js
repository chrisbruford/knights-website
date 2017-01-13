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
let helmet = require('helmet');

//routes
let home = require('./routes/index');
let register = require('./routes/register');
let members = require('./routes/members');
let login = require('./routes/login');
let logout = require('./routes/logout');
let authcheck = require('./routes/authcheck');
let secure = require('./routes/secure');
let activate = require('./routes/activate');
let recover = require('./routes/recover');
let resetPassword = require('./routes/resetPassword');

let app = express();

//security headers

app.use(helmet({
    hsts: {
      force: true,
      maxAge: 300
    }
}))

app.use(requireHTTPS);
app.use(function (req, res, next) {
  res.header("X-powered-by", "Blood, sweat, and tears")
  next()
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'anything' }));
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

//use secure connections
function requireHTTPS(req, res, next) {
  var isAzure = req.get('x-site-deployment-id'),
    isSsl = req.get('x-arr-ssl');

  if (isAzure && !isSsl) {
    return res.redirect('https://' + req.get('host') + req.url);
  }

  next();
}

//serve

app.use('/', home);
app.use('/register', register);
app.use('/members', members);
app.use('/login', login);
app.use('/logout', logout);
app.use('/authcheck', authcheck);
app.use('/secure', secure);
app.use('/activate', activate);
app.use('/recover', recover);
app.use('/resetpassword', resetPassword);
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

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
