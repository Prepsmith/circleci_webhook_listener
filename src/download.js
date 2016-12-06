var fs = require('fs');
var request = require('request');
var requestify = require('requestify');
var progress = require('request-progress');

var KB_SIZE = 1000
var MB_SIZE = KB_SIZE * 1000
var APK_DOWNLOAD_PREFIX = 'APK download'
var DECIMALS = 2

exports.start = function (uri, path, log, callback) {

    if (uri == null || uri.length == 0){throw new Error('uri is null'); callback(false); return;}
    if (path == null || path.length == 0){throw new Error('path is null'); callback(false); return;}
    if (typeof uri != 'string'){throw new Error('uri is not a string ' + uri); callback(false); return;}
    if (typeof path != 'string'){throw new Error('path is not a string ' + path); callback(false); return;}

    progress(request(uri))
    .on('progress', 
        function (state) {
            if(log){console.log(formatState(state))}
        })
    .on('response', 
        function (response) {
            if(log){console.log(APK_DOWNLOAD_PREFIX + ' status code:', response.statusCode)}
        })
    .on('error', 
        function (error) {
            if(log){console.log(APK_DOWNLOAD_PREFIX + ' error:', error)}
            callback(false)
        })
    .on('end', 
        function () {
            if(log){console.log(APK_DOWNLOAD_PREFIX + ' finished downloading ' + path)}
            callback(true)
        })
    .pipe(fs.createWriteStream(path))
};

var formatState = function(state){
    return APK_DOWNLOAD_PREFIX + 
    ' elapsed: ' + 
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