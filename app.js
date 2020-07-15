"use strict";
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const morganLogger = require("morgan");
const logger = require("./modules/logger");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("./db").mongoose;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const session = require("express-session");
const helmet = require("helmet");
const MongoStore = require("connect-mongo")(session);
const IP_MONITOR = require("./middleware/ip-monitor");

//routes
const home = require("./routes/index");
const register = require("./routes/register");
const members = require("./routes/members");
const login = require("./routes/login");
const logout = require("./routes/logout");
const authcheck = require("./routes/authcheck");
const secure = require("./routes/secure");
const activate = require("./routes/activate");
const recover = require("./routes/recover");
const resetPassword = require("./routes/resetPassword");
const wing = require("./routes/wing");
const discordAuth = require("./routes/discord-auth");
const missions = require("./routes/companion-app/missions");
const combat = require("./routes/companion-app/combat");
const fleetCarriers = require("./routes/companion-app/fleet-carriers");

const app = express();

//IP Monitor
app.use(IP_MONITOR);

//for Let's Encrypt
app.use("/.well-known/acme-challenge/:fileid", function (req, res) {
  res.sendFile(
    path.join(__dirname, `.well-known/acme-challenge/${req.params.fileid}`)
  );
});

//security headers

app.use(
  helmet({
    hsts: {
      force: true,
      maxAge: 2419200, //4 weeks
      preload: true,
    },
  })
);

app.use(requireHTTPS);
app.use(function (req, res, next) {
  res.header("X-powered-by", "Blood, sweat, and tears");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morganLogger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//mongo session store
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: process.env.cookieSecret || require("./secrets").cookieSecret,
    secure: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//mongoose passport config
mongoose.Promise = global.Promise;
require("./models/user").then((User) => {
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
});

//discord passport config
let scope = ["identify"];

passport.use(
  new DiscordStrategy(
    {
      clientID:
        process.env.discordClientID || require("./secrets").discord.clientID,
      clientSecret:
        process.env.discordClientSecret ||
        require("./secrets").discord.clientSecret,
      callbackURL:
        process.env.discordCallback || require("./secrets").discord.callback,
      resave: true,
      saveUninitialized: true,
      scope,
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

//allow CORS requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//use secure connections
function requireHTTPS(req, res, next) {
  var isAzure = req.get("x-site-deployment-id"),
    isSsl = req.get("x-arr-ssl");

  if (isAzure && !isSsl) {
    return res.redirect("https://" + req.get("host") + req.url);
  }

  next();
}

//serve
app.use("/", home);
app.use("/secure", secure);
app.use("/api/register", register);
app.use("/api/members", members);
app.use("/api/login", login);
app.use("/api/logout", logout);
app.use("/api/authcheck", authcheck);
app.use("/api/activate", activate);
app.use("/api/recover", recover);
app.use("/api/resetpassword", resetPassword);
app.use("/api/wing", wing);
app.use("/discord", discordAuth);
//companion app routes
app.use("/api/combat", combat);
app.use("/api/missions", missions);
app.use("/api/fleet-carriers", fleetCarriers);

//checks auth level before sending these
app.use("/secure", secure);

//catchall redirect for angular html5Mode
app.use("/*", home);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    logger.log(err);
    res.status(err.status || 500);
    res.send(err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  logger.log(err);
  res.status(err.status || 500);
  res.send(err.message);
});

//Discord bot
let kokBot = require("./modules/kok-bot");

//local variables
app.locals.guildID = "272391171416784897";

module.exports = app;
