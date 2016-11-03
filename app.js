var express = require('express');
var app = express();

var request = require('request');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/cim', function (req, res) {
    res.send('This is CIM!');
});

app.get('/snmp', function (req, res) {
    res.send('This is SNMP!');
});

app.get('/request', function (req, res) {

    var OS_COMMAND = '\
        <?xml version="1.0" encoding="utf-8" ?> \
        <CIM CIMVERSION="2.0" DTDVERSION="2.0"> \
        <MESSAGE ID="4711" PROTOCOLVERSION="1.0"><SIMPLEREQ><IMETHODCALL NAME="EnumerateInstances"><LOCALNAMESPACEPATH><NAMESPACE NAME="root"></NAMESPACE><NAMESPACE NAME="cimv2"></NAMESPACE></LOCALNAMESPACEPATH> \
        <IPARAMVALUE NAME="ClassName"><CLASSNAME NAME="CIM_OperatingSystem"/></IPARAMVALUE> \
        <IPARAMVALUE NAME="DeepInheritance"><VALUE>TRUE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="LocalOnly"><VALUE>FALSE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="IncludeQualifiers"><VALUE>FALSE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="IncludeClassOrigin"><VALUE>TRUE</VALUE></IPARAMVALUE> \
        </IMETHODCALL></SIMPLEREQ> \
        </MESSAGE></CIM>';

    var options = {
        url: 'http://ttm4128.item.ntnu.no:5988/cimom',
        method: 'POST',
        headers: {
            'Content-Type':'application/xml; charset="utf-8"',
            'CIMProtocolVersion': '2.0',
            'CIMOperation': 'MethodCall'
        },
        body: OS_COMMAND
    };

    request(options, function (error, response, body) {
        var parseString = require('xml2js').parseString;

        var xml = body
        parseString(xml, function (err, result) {

            var value = result['CIM']['MESSAGE'][0]['SIMPLERSP'][0]['IMETHODRESPONSE'][0]['IRETURNVALUE'][0]['VALUE.NAMEDINSTANCE'][0]
                ['INSTANCE'][0]['PROPERTY'][0]['VALUE'][0]

            var startIndex = value.indexOf('PRETTY_NAME="') + 'PRETTY_NAME="'.length;
            var endIndex = value.indexOf('"', startIndex);

            var OSversion = value.substring(startIndex, endIndex);

            res.send(OSversion);

        });
    })
});


app.get('/test', function (req, res) {
    var parseString = require('xml2js').parseString;
    var xml = "<root><test>Hello xml2js!</test></root>"
    parseString(xml, function (err, result) {
        var object = result;

        res.send(object[0][0]);
    });
});



app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

