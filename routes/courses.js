"use strict";
let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

let db = require('../db');
db.then(function(db){
  require('../modules/getData/getData').getInstructors(db)
    .then(function(data){ res.json(data); })
    .catch(function(err){ console.log(err); res.json({})});
}).catch(function(err){
  console.dir(err);
})

});

module.exports = router;
