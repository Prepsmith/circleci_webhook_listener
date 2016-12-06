var express = require('express')
var app = express()

var request = require('request');
var requestify = require('requestify');
//var http = require('http');

var bodyParser = require('body-parser')
app.use(bodyParser.json())

var settingsLoader = require('./src/settingsLoader');
var token = require('./src/token');
var download = require('./src/download');
var apkPath = require('./src/apkPath');
var artifactsUrl = require('./src/artifactsUrl');

settings = {}

var SETTINGS_FILE_PATH = '/settings.json'
var HTTP_SUCCES = 200
var HTTP_INTERNAL_SERVER_ERROR = 500
var HTTPS_PREFIX = 'https://'

//on start
console.log("loading settings from settings.json")
try{
    settingsLoader.load(SETTINGS_FILE_PATH,function(err,res){
        if(err){console.log('caught error', err)} else {
            settings = res;
            app.listen(settings.port, function () {
                console.log('Waiting for webhooks from CircleCI on port ' + settings.port)
            });
        }
    });
}catch (err){
    console.log('caught error', err);
}

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
        artifactsUrl.obtain(build_number,function(err,artifactsUrl){
            if (err) {throw err};
            console.log('build ' + build_number + ' status: ' + status)
            requestify.get(artifactsUrl).then(function(response) {
                getUrlFromBody(JSON.parse(response.getBody()),function(err,body_url){
                    if (err) {throw err};
                    apkPath.obtain(body_url, function(err,apkPath){
                        if (err) {throw err};
                        token.append(body_url,function(err,download_url){
                            if (err) {throw err};
                            console.log('starting download of ' + apkPath)
                            download.start(download_url, apkPath, true);
                        });
                    });
                });
            }).fail(function(response) {
                console.log('error caught: ' + response)
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