"use strict";
let nodemailer = require('nodemailer');
let mg = require('nodemailer-mailgun-transport');

let auth = {
  auth: {
    api_key: 'key-57e370414573a1093dd38cf867df4544',
    domain: 'mail.knightsofkarma.com'
  }
}

let nodemailerMailgun = nodemailer.createTransport(mg(auth));

module.exports.sendMail = function(options, callback) {
  nodemailerMailgun.sendMail(options,callback);
}