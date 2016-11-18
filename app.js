// Requirements
var express = require('express');
var app = express();
require('shelljs/global');

// Set Express Engine
app.set('views', './views');
app.set('view engine', 'pug');

var cim = require('./controllers/cim.js');
var snmp = require('./controllers/snmp.js');

// CIM rendering (webroot)
app.get('/', function (req, res) {
    // Get CIM-data asynchronously
    cim.cimGetData(function(data) {
        res.render("cim", { osVersion: data[0], interfaces: data[1] });
    });
});

// SNMP rendering
app.get('/snmp', function (req, res) {
    // Get SNMP-data synchronously
    var data = snmp.snmpGetData();
    res.render("snmp", { osVersion: data[0], interfaces: data[1] });
});

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});

