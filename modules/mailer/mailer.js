"use strict";
let nodemailer = require('nodemailer');
let mg = require('nodemailer-mailgun-transport');

let auth = {
  auth: {
    api_key: 'key-57e370414573a1093dd38cf867df4544',
    domain: 'sandboxa9b3c634b6dd48a9a99ebcb9aa982278.mailgun.org'
  }
}

let nodemailerMailgun = nodemailer.createTransport(mg(auth));

module.exports.sendMail = function(options, callback) {
  nodemailerMailgun.sendMail(options,callback);
}