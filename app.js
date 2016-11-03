var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.get('/cim', function (req, res) {
    res.send('This is CIM!')
});

app.get('/snmp', function (req, res) {
    res.send('This is SNMP!')
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});