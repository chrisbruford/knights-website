"use strict";
require('../../db')
.then(mongoose=>{

    let passport = require('passport');
    let passportLocal = require('passport-local');
    let Schema = mongoose.Schema;
    let passportLocalMongoose = require('passport-local-mongoose');

    //setting up Passport;
    var User = require('./models/user');
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

});