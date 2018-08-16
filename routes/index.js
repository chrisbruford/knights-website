"use strict";
let express = require('express');
let router = express.Router();
let path = require('path');
let fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, `../public/index.html`));
});

router.get('/companion', function (req, res, next) {
    fs.readdir(path.resolve(__dirname, '../public'), (err, filepaths) => {
        if (!filepaths) { res.sendStatus(404) };
        if (err) { res.sendStatus(500) };

        let appPath = filepaths.filter(path=>/^knight-companion Setup [0-9].[0-9].[0-9].exe$/.test(path)).sort().pop();

        if (!appPath) { res.sendStatus(404) }
        else { res.download(path.resolve(__dirname, `../public/${appPath}`),`knight companion setup.exe`) }
    });
})

module.exports = router;
