var DEFAULT_PORT = 3000
exports.DEFAULT_PORT = DEFAULT_PORT
var fs = require('fs');
var path = require('path');

var DEFAULT_DOWNLOAD_PATH = path.join(process.cwd(),'downloads');
exports.DEFAULT_DOWNLOAD_PATH = DEFAULT_DOWNLOAD_PATH

exports.load = function(settingsPath, callback){
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
            res.download_path = path.dirname(res.download_path.replace(/{cwd}/g, process.cwd()))
        }
        if(!res.ip){
            console.log('ip was not found in settings.json, allowing requests from all addresses')
        }
        console.log('successfully loaded settings');
        callback(null,res);
    });
};