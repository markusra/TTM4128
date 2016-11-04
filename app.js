// Requirements
var express = require('express');
var app = express();

// Set Express Engine
app.set('views', './views');
app.set('view engine', 'pug');

var cim = require('./controllers/cim.js');

app.get('/cim', function (req, res) {
    cim.cimGetData(function(data) {
        res.render("cim", { osVersion: data[0], interfaces: data[1] });
    });
});

app.get('/snmp', function (req, res) {
    res.send('This is SNMP!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

