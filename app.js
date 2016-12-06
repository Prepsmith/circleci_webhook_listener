var express = require('express')
var app = express()

var promise = require('promise');

var requestify = require('requestify');
var http = require('http');
var fs = require('fs');
var request = require('request');
var progress = require('request-progress');

var bodyParser = require('body-parser')
app.use(bodyParser.json())

var APK_EXTENSION = '.apk'
var DEFAULT_DOWNLOAD_PATH = process.cwd() + '\\downloads\\'
exports.DEFAULT_DOWNLOAD_PATH = DEFAULT_DOWNLOAD_PATH

var APK_DOWNLOAD_PREFIX = 'APK download'
var DECIMALS = 2

var settings = {}

var DEFAULT_PORT = 3000
exports.DEFAULT_PORT = DEFAULT_PORT

var SETTINGS_FILE_PATH = '/settings.json'

var loadSettings = function(settingsPath, callback){
    fs.readFile(process.cwd() + settingsPath, 'utf8', function (err,data) {
        if (err) { callback(err); return;}
        res = JSON.parse(data);
        if (!res.circle_ci_token){callback(new Error('field \"circle_ci_token\" was not found in settings.json')); return;}
        if (!res.circle_ci_url){callback(new Error('field \"circle_ci_url\" was not found in settings.json')); return;}
        if (!res.port){
            console.log('port field was not found in settings.json, using ' + DEFAULT_PORT + ' as default') 
            res.port = DEFAULT_PORT
        }
        if (!res.download_path){
            console.log('download_path field was not found in settings.json, using\n' + DEFAULT_DOWNLOAD_PATH + '\nas default') 
            res.download_path = DEFAULT_DOWNLOAD_PATH
        } else {
            res.download_path = res.download_path.replace(/{cwd}/g, process.cwd())
        }
        console.log('successfully loaded settings');
        callback(null,res);
    });
};
exports.loadSettings = loadSettings

//on start
console.log("loading settings from settings.json")
try{
    loadSettings(SETTINGS_FILE_PATH,function(err,res){
        settings = res;
        app.listen(settings.port, function () {
            console.log('Waiting for webhooks from CircleCI on port ' + settings.port)
        });
    });
} catch(err){
    throw err;
}

var HTTP_SUCCES = 200
var HTTP_INTERNAL_SERVER_ERROR = 500

var getUrlFromBody = function(body,callback){
    if (!body){callback(new Error('body was a null, body:' + body)); return;}
    if (!body[0]){callback(new Error('no apk file was found in body, body:' + body)); return;}
    if (!body[0].url){callback(new Error('no url found for apk, body:' + body)); return;}
    if (!body[0].url.startsWith(HTTPS_PREFIX)){callback(new Error('url \'' + url + '\' doesn\'t start with correct https prefix, body:' + body)); return;};
    callback(null,body[0].url)
}

app.post('/webhook', function(req, res){
    try{
        console.log('Obtained notification from CircleCI')
        var status = req.body.status
        var build_number = req.body.build_num
        obtainArtifactsUrl(build_number,function(err,artifactsUrl){
            if (err) {throw err};
            console.log('build ' + build_number + ' status: ' + status)
            requestify.get(artifactsUrl).then(function(response) {
                getUrlFromBody(JSON.parse(response.getBody()),function(err,body_url){
                    if (err) {throw err};
                    obtainAPKpath(body_url,function(err,apkPath){
                        if (err) {throw err};
                        appendToken(body_url,function(err,download_url){
                            if (err) {throw err};
                            console.log('starting download of ' + apkPath)
                            download(download_url, apkPath, true);
                        });
                    });
                });
            });
            res.status(HTTP_SUCCES);
            res.send();
        });
    } catch (err) {
        console.log('caught error', err)
        res.status(HTTP_INTERNAL_SERVER_ERROR);
        res.send();
    }
});

var HTTPS_PREFIX = 'https://'

var appendToken = function(url,callback){
    if (url == null || url.length == 0){callback(new Error('url is null')); return;};
    if (!url.startsWith(HTTPS_PREFIX)){callback(new Error('url \'' + url + '\' doesn\'t start with correct https prefix')); return;};
    
    callback(null,url + '?circle-token=' + settings.circle_ci_token)
}
exports.appendToken = appendToken

var obtainArtifactsUrl = function(buildNumber,callback){
    if (buildNumber == null){callback(new Error('buildNumber is null')); return;}
    if (typeof buildNumber != 'number'){callback(new Error('buildNumber ' + buildNumber + ' is not a number')); return;}
    appendToken(settings.circle_ci_url + buildNumber + '/artifacts',function(err,res) {
        if (err) {callback(err)} 
        else {callback(null,res)}
    });
}
exports.obtainArtifactsUrl = obtainArtifactsUrl

var obtainAPKpath = function(url,callback){
    if (url == null || url.length == 0){callback(new Error('url is null')); return;}
    if (url.indexOf(APK_EXTENSION) == -1){callback(new Error('url ' + url + ' doesn\'t contain an apk file')); return;}
    var matches = url.match('apk/(.*)' + APK_EXTENSION)

    if (matches == null || matches.length < 1){callback(new Error('url didn\t match regex')); return;}

    var fileName = matches[1] + APK_EXTENSION
    
    fs.mkdir(settings.download_path, null , function(err) {
        if (err && err.code != 'EEXIST'){ throw err}
    });

    callback(null,settings.download_path + fileName)
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
exports.download = download