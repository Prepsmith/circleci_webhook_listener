var HTTPS_PREFIX = 'https://'

exports.append = function(url,callback){
    if (url == null || url.length == 0){callback(new Error('url is null')); return;};
    if (!url.startsWith(HTTPS_PREFIX)){callback(new Error('url \'' + url + '\' doesn\'t start with correct https prefix')); return;};
    
    callback(null,url + '?circle-token=' + settings.circle_ci_token)
}