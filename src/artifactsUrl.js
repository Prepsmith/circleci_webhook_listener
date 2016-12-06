var token = require('./token');

exports.obtain = function(buildNumber,callback){
    if (buildNumber == null){callback(new Error('buildNumber is null')); return;}
    if (typeof buildNumber != 'number'){callback(new Error('buildNumber ' + buildNumber + ' is not a number')); return;}
    token.append(settings.circle_ci_url + buildNumber + '/artifacts',function(err,res) {
        if (err) {callback(err)} 
        else {callback(null,res)}
    });
}