"use strict";
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('./db');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let DiscordStrategy = require('passport-discord').Strategy;
let session = require('express-session');
let helmet = require('helmet');
let MongoStore = require('connect-mongo')(session);

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
let wing = require('./routes/wing');
let discordAuth = require('./routes/discord-auth')

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

//mongo session store

let store = new MongoStore({ mongooseConnection: mongoose.connection });

app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: process.env.db_uname || require('./secrets').cookieSecret
}))

app.use(passport.initialize());
app.use(passport.session());

//mongoose passport config
mongoose.Promise = global.Promise;
require('./models/user').then(User => {
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
});

//discord passport config
let scope = ['identify'];

passport.use(new DiscordStrategy({
  clientID: require('./secrets.js').discord.clientID,
  clientSecret: require('./secrets.js').discord.clientSecret,
  callbackURL: require('./secrets.js').discord.callback,
  scope
},
  function (accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
))

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
app.use('/api/register', register);
app.use('/api/members', members);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/authcheck', authcheck);
app.use('/api/activate', activate);
app.use('/api/recover', recover);
app.use('/api/resetpassword', resetPassword);
app.use('/api/wing', wing);
app.use('/discord', discordAuth);

//for Let's Encrypt
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

//checks auth level before sending these
app.use('/secure', secure);

//catchall redirect for angular html5Mode
app.use('/*', home);

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
    console.log(err);
    res.status(err.status || 500);
    res.send(err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.send(err.message);
});

//Discord bot
let kokBot = require('./modules/kok-bot');

//local variables
app.locals.guildID = "272391171416784897";

module.exports = app;
