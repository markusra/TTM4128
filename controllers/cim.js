// Requirements
var request = require('request');
var parseString = require('xml2js').parseString;
var async = require('async');

// Main function (callbacks for all asynchronous functions)
var cimGetData = function(mainCallback) {
    async.series([
            function(callback){
                cimOSVersion(function(osVersion) {
                    callback(null, osVersion);
                });
            },
            function(callback){
                cimIPInterfaces(function(ipInterfaces) {
                    callback(null, ipInterfaces);
                });
            }
        ],
        function(err, results){
            mainCallback(results)
        });
};

// Universal function for all requests
function getCIMResponse(cmd, callback) {
    // Set message header and body
    var options = {
        url: 'http://ttm4128.item.ntnu.no:5988/cimom',
        method: 'POST',
        headers: {
            'Content-Type':'application/xml; charset="utf-8"',
            'CIMProtocolVersion': '2.0',
            'CIMOperation': 'MethodCall'
        },
        body: cmd
    };

    // Make an asynchronous request with a callback
    request(options, function (error, response, body) {
        callback(body);
    });
}

// Get OS version with CIM
var cimOSVersion = function(callback) {
    // Create CIM body for the request
    var OS_COMMAND = '\
        <?xml version="1.0" encoding="utf-8" ?> \
        <CIM CIMVERSION="2.0" DTDVERSION="2.0"> \
        <MESSAGE ID="1337" PROTOCOLVERSION="1.0"><SIMPLEREQ><IMETHODCALL NAME="EnumerateInstances"><LOCALNAMESPACEPATH><NAMESPACE NAME="root"></NAMESPACE><NAMESPACE NAME="cimv2"></NAMESPACE></LOCALNAMESPACEPATH> \
        <IPARAMVALUE NAME="ClassName"><CLASSNAME NAME="CIM_OperatingSystem"/></IPARAMVALUE> \
        <IPARAMVALUE NAME="DeepInheritance"><VALUE>TRUE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="LocalOnly"><VALUE>FALSE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="IncludeQualifiers"><VALUE>FALSE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="IncludeClassOrigin"><VALUE>TRUE</VALUE></IPARAMVALUE> \
        </IMETHODCALL></SIMPLEREQ> \
        </MESSAGE></CIM>';

    // Trigger the asynchronous request
    getCIMResponse(OS_COMMAND, function(xml) {
        getOSVersion(xml, function(osVersion) {
            callback(osVersion);
        });
    });
};

// Fetch OS version from XML response
function getOSVersion(xml, callback) {
    parseString(xml, function (err, result) {
        var value = result['CIM']['MESSAGE'][0]['SIMPLERSP'][0]['IMETHODRESPONSE'][0]['IRETURNVALUE'][0]['VALUE.NAMEDINSTANCE'][0]
            ['INSTANCE'][0]['PROPERTY'][0]['VALUE'][0];

        var startIndex = value.indexOf('PRETTY_NAME="') + 'PRETTY_NAME="'.length;
        var endIndex = value.indexOf('"', startIndex);
        var osVersion = value.substring(startIndex, endIndex);
        callback(osVersion)
    });
}

// Get OS version with CIM
var cimIPInterfaces = function(callback) {
    // Create CIM body for the request
    var IP_COMMAND = '\
        <?xml version="1.0" encoding="utf-8" ?> \
        <CIM CIMVERSION="2.0" DTDVERSION="2.0"> \
        <MESSAGE ID="1337" PROTOCOLVERSION="1.0"><SIMPLEREQ><IMETHODCALL NAME="EnumerateInstances"><LOCALNAMESPACEPATH><NAMESPACE NAME="root"></NAMESPACE><NAMESPACE NAME="cimv2"></NAMESPACE></LOCALNAMESPACEPATH> \
        <IPARAMVALUE NAME="ClassName"><CLASSNAME NAME="CIM_IPProtocolEndpoint"/></IPARAMVALUE> \
        <IPARAMVALUE NAME="DeepInheritance"><VALUE>TRUE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="LocalOnly"><VALUE>FALSE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="IncludeQualifiers"><VALUE>FALSE</VALUE></IPARAMVALUE> \
        <IPARAMVALUE NAME="IncludeClassOrigin"><VALUE>TRUE</VALUE></IPARAMVALUE> \
        </IMETHODCALL></SIMPLEREQ> \
        </MESSAGE></CIM>';

    // Trigger the asynchronous request
    getCIMResponse(IP_COMMAND, function(xml) {
        getIPInterfaces(xml, function(interfaces) {
            callback(interfaces);
        });
    });
};

// Fetch OS version from XML response
function getIPInterfaces(xml, callback) {
    parseString(xml, function (err, result) {
        var values = result['CIM']['MESSAGE'][0]['SIMPLERSP'][0]['IMETHODRESPONSE'][0]['IRETURNVALUE'][0]['VALUE.NAMEDINSTANCE'];

        var interfaces = [];
        for (var i = 0; i < values.length; i++) {
            var ifInfo = [];
            ifInfo.push(values[i]['INSTANCE'][0]['PROPERTY'][20]['VALUE'][0]);
            ifInfo.push(values[i]['INSTANCE'][0]['PROPERTY'][34]['VALUE'][0]);
            ifInfo.push(values[i]['INSTANCE'][0]['PROPERTY'][31]['VALUE'][0]);
            interfaces.push(ifInfo)
        }
        callback(interfaces);
    });
}


exports.cimGetData = cimGetData;