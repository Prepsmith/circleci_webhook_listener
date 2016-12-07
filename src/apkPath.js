var fs = require('fs');
var path = require('path');

var APK_EXTENSION = '.apk'

exports.obtain = function(url, callback){
    if (url == null || url.length == 0){callback(new Error('url is null')); return;}
    if (url.indexOf(APK_EXTENSION) == -1){callback(new Error('url ' + url + ' doesn\'t contain an apk file')); return;}
    var matches = url.match('apk/(.*)' + APK_EXTENSION)

    if (matches == null || matches.length < 1){callback(new Error('url didn\t match regex')); return;}

    var fileName = matches[1] + APK_EXTENSION

    fs.mkdir(settings.download_path, null , function(err) {
        if (err && err.code != 'EEXIST'){ throw err}
    });
    console.log('@new1',path.join(settings.download_path, fileName))
    callback(null,path.join(settings.download_path + '\\' + fileName))
}