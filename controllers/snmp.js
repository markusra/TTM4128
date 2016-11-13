var snmpGetData = function() {
    var snmpOsVersionList = exec('snmpget -v 2c -c ttm4128 localhost sysDescr.0', {silent:true}).stdout.split('STRING: ')[1].split(' ');
    var snmpOsVersion = snmpOsVersionList[0] + ' ' + snmpOsVersionList[2];

    var snmpInterfaces = exec('snmpwalk -c ttm4128 -v 2c localhost ipAdEntIfIndex', {silent:true}).stdout.split('IP-MIB::');

    var interfaces = [];
    for (var i = 1; i <  snmpInterfaces.length; i++) {
        var interfaceInfo = snmpInterfaces[i].substring(snmpInterfaces[i].indexOf('.') + 1).split(' = INTEGER: ');
        var interfaceIP = interfaceInfo[0];
        var interfaceIndex = interfaceInfo[1];
        var interfaceName = exec('snmpget -c ttm4128 -v 2c localhost ifDescr.' + interfaceIndex, {silent:true}).stdout.split('STRING: ')[1].trim();
        var interfaceMask = exec('snmpget -c ttm4128 -v 2c localhost ipAdEntNetMask.' + interfaceIP, {silent:true}).stdout.split('IpAddress: ')[1].trim();
        interfaces.push([interfaceName, interfaceIP, interfaceMask]);
    }
    return [snmpOsVersion, interfaces];
};

exports.snmpGetData = snmpGetData;