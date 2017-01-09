"use strict";
let nodemailer = require('nodemailer');
let mg = require('nodemailer-mailgun-transport');

let api_key = process.env.nm_api_key || require('../../secrets.js').nodemailer.api_key;
let domain = process.env.nm_domain || require('../../secrets.js').nodemailer.domain;

let auth = {
  auth: {api_key,domain}
}

let nodemailerMailgun = nodemailer.createTransport(mg(auth));

module.exports.sendMail = function(options, callback) {
  nodemailerMailgun.sendMail(options,callback);
}