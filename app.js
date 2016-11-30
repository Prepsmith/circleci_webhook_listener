var express = require('express')
var app = express()

var requestify = require('requestify');
var http = require('http');
var fs = require('fs');
var request = require('request');
var progress = require('request-progress');

var bodyParser = require('body-parser')
app.use(bodyParser.json())

var APK_EXTENSION = '.apk'
var DEFAULT_DOWNLOAD_PATH = process.cwd() + '\\downloads\\'

var APK_DOWNLOAD_PREFIX = 'APK download'
var DECIMALS = 2

var settings = {}

var DEFAULT_PORT = 3000
var SETTINGS_FILE_PATH = '/settings.json'

//on start
fs.readFile(process.cwd() + SETTINGS_FILE_PATH, 'utf8', function (err,data) {
    if (err) { return console.log(err) }
    settings = JSON.parse(data);
    if (!settings.circle_ci_token){throw new Error('field \"circle_ci_token\" was not found in settings.json')}
    if (!settings.circle_ci_url){throw new Error('field \"circle_ci_url\" was not found in settings.json')}
    if (!settings.port){
        console.log('port field was not found in settings.json, using ' + DEFAULT_PORT + ' as default') 
        settings.port = DEFAULT_PORT
    }
    if (!settings.download_path){
        console.log('download_path field was not found in settings.json, using\n' + DEFAULT_DOWNLOAD_PATH + '\nas default') 
        settings.download_path = DEFAULT_DOWNLOAD_PATH
    } else {
        settings.download_path = settings.download_path.replace(/{cwd}/g, process.cwd())
    }
    console.log('successfully loaded settings')
    app.listen(3123, function () {
        console.log('Waiting for webhooks from CircleCI on port ' + settings.port)
    })
});

var HTTP_SUCCES = 200
var HTTP_INTERNAL_SERVER_ERROR = 500

app.post('/webhook', function(req, res){
    try{
        console.log('Obtained notification from CircleCI')

        var status = req.body.status
        var build_number = req.body.build_num
        var artifactsUrl = obtainArtifactsUrl(build_number)

        console.log('build ' + build_number + ' status: ' + status)

        requestify.get(artifactsUrl).then(function(response) {
            var body = JSON.parse(response.getBody());
            var body_url = body[0].url
            var apkPath = obtainAPKpath(body_url);
            var download_url = appendToken(body_url);

            console.log('starting download of ' + apkPath)

            download(download_url, apkPath, true);
        });

        res.status(HTTP_SUCCES);
        res.send();
    } catch (err) {
        console.log('caught error', err)
        res.status(HTTP_INTERNAL_SERVER_ERROR);
        res.send();
    }
});

var HTTPS_PREFIX = 'https://'

var appendToken = function(url){
    if (url == null || url.length == 0){throw new Error('url is null')};
    if (!url.startsWith(HTTPS_PREFIX)){throw new Error('url \'' + url + '\' doesn\'t start with correct https prefix')};
    
    return url + '?circle-token=' + settings.circle_ci_token
}
exports.appendToken = appendToken

var obtainArtifactsUrl = function(buildNumber){
    if (buildNumber == null){throw new Error('buildNumber is null')}
    if (typeof buildNumber != 'number'){throw new Error('buildNumber ' + buildNumber + ' is not a number')}

    return appendToken(settings.circle_ci_url + buildNumber + '/artifacts')
}
exports.obtainArtifactsUrl = obtainArtifactsUrl

var obtainAPKpath = function(url){
    if (url == null || url.length == 0){throw new Error('url is null')}
    if (url.indexOf(APK_EXTENSION) == -1){throw new Error('url ' + url + ' doesn\'t contain an apk file')}
    var matches = url.match('apk/(.*)' + APK_EXTENSION)

    if (matches == null || matches.length < 1){throw new Error('url didn\t match regex')}

    var fileName = matches[1] + APK_EXTENSION
    var downloadDir = process.cwd() + DOWNLOAD_PATH
    
    fs.mkdir(downloadDir, null , function(err) {
        if (err && err.code != 'EEXIST'){ throw err}
    });

    return downloadDir + fileName
}
exports.obtainAPKpath = obtainAPKpath

var KB_SIZE = 1000
var MB_SIZE = KB_SIZE * 1000

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

var download = function (uri, path, log, callback) {

    if (uri == null || uri.length == 0){throw new Error('uri is null'); callback(false);}
    if (path == null || path.length == 0){throw new Error('path is null'); callback(false);}
    if (typeof uri != 'string'){throw new Error('uri is not a string ' + uri); callback(false);}
    if (typeof path != 'string'){throw new Error('path is not a string ' + path); callback(false);}

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
exports.download = download