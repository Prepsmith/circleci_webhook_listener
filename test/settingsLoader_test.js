var assert = require('assert');
var settingsLoader = require('../src/settingsLoader');
var path = require('path');

describe('Settings', function(){
    it('can load settings', function(done) {
        settingsLoader.load(path.normalize('/test/settings/correct.json'),function(err,res){
            if (err){ throw err}
            assert(res.port);
            assert(typeof(res.port) == 'number');
            assert(res.circle_ci_token);
            assert(typeof(res.circle_ci_token) == 'string');
            assert(res.circle_ci_url);
            assert(typeof(res.circle_ci_url) == 'string');
            assert(res.download_path);
            assert(typeof(res.download_path) == 'string');
            done();
        });
    });

    it('will default to default port', function(done) {
        settingsLoader.load(path.normalize('/test/settings/noPort.json'),function(err,res){
            assert(!err,err)
            assert(res.port == settingsLoader.DEFAULT_PORT,'default ports didn\' match ' + res.port + ' and ' + settingsLoader.DEFAULT_PORT);
            done();
        });
    });

    it('will default to default download path', function(done) {
        settingsLoader.load(path.normalize('/test/settings/noPath.json'),function(err,res){
            assert(!err,err)
            assert(res.download_path == settingsLoader.DEFAULT_DOWNLOAD_PATH,'default ports didn\' match ' + res.download_path + ' and ' + settingsLoader.DEFAULT_DOWNLOAD_PATH);
            done();
        });
    });

    it('won\'t accept empty settings', function(done) {
        settingsLoader.load(path.normalize('/test/settings/empty.json'),function(err,res){
            if (!err){throw new Error('accepted empty settings file')}
            done();
        });
    });

    it('won\'t accept missing or empty token', function(done) {
        settingsLoader.load(path.normalize('/test/settings/noToken.json'),function(err,res){
            if (!err){throw new Error('accepted settings file without token')}
            done();
        });
    });

    it('won\'t accept missing or empty url', function(done) {
        settingsLoader.load(path.normalize('/test/settings/noUrl.json'),function(err,res){
            if (!err){throw new Error('accepted settings file without url')}
            done();
        });
    });
});