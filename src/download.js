var fs = require('fs');
var request = require('request');
var requestify = require('requestify');
var progress = require('request-progress');

var KB_SIZE = 1000
var MB_SIZE = KB_SIZE * 1000
var DEFAULT_PREFIX = 'APK download'
var DECIMALS = 2

exports.start = function (prefix, uri, path, log, callback) {

    if (uri == null || uri.length == 0){throw new Error('uri is null'); callback(false); return;}
    if (path == null || path.length == 0){throw new Error('path is null'); callback(false); return;}
    if (typeof uri != 'string'){throw new Error('uri is not a string ' + uri); callback(false); return;}
    if (typeof path != 'string'){throw new Error('path is not a string ' + path); callback(false); return;}
    if (!prefix){prefix = DEFAULT_PREFIX}
    progress(request(uri))
    .on('progress', 
        function (state) {
            if(log){console.log(formatState(prefix,state))}
        })
    .on('response', 
        function (response) {
            if(log){console.log(prefix + ' status code:', response.statusCode)}
        })
    .on('error', 
        function (error) {
            if(log){console.log(prefix + ' error:', error)}
            callback(false)
        })
    .on('end', 
        function () {
            if(log){console.log(prefix + ' finished downloading ' + path)}
            callback(true)
        })
    .pipe(fs.createWriteStream(path))
};

var formatState = function(prefix,state){
    return prefix + 
    '\telapsed: ' + 
    round_dec(state.time.elapsed,DECIMALS) +
    ' s\tspeed: ' + 
    round_dec(state.speed/KB_SIZE,DECIMALS)+ 
    ' KB/s\ttransferred: ' + 
    round_dec(state.size.transferred/MB_SIZE,DECIMALS) + 
    'MB'
}

var round_dec = function(value,decimals){
    var dec_mul = Math.pow(10,decimals)
    return Math.round(value * dec_mul) / dec_mul
}