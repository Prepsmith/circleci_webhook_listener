var assert = require('assert');
var appTest = require('../app.js');
var remove = require('remove');
var fs = require('fs');

var DOWNLOAD_DIR = '/test/downloads'
var LOG_OUTPUT = false

describe('WebHook unit tests', function() {

    before(function(done){
        fs.mkdir(process.cwd() + DOWNLOAD_DIR, null , function(err) {
            if (err && err.code != 'EEXIST'){ throw err}
            done();
        });
    });

    describe('AppendToken', function() {
    	it('works with correct input', function() {
    	   appTest.appendToken('https://correct.url/',function(err,res){
                assert(!err)
           });
        });
        it('doesn\'t work when there is no https', function() {
        	assert.throws(function(){ 
        		appTest.appendToken('missing https in url') 
        	}, Error,'appendToken allowed a link without \'https://\'');
        });
        it('doesn\'t work when there is no url', function() {
        	assert.throws(function(){ 
        		appTest.appendToken(null) 
        	}, Error,'appendToken allowed a link without \'https://\'');
        	assert.throws(function(){ 
        		appTest.appendToken('') 
        	}, Error,'appendToken allowed a link without \'https://\'');
        });
    });

    describe('obtainArtifactsUrl', function() {
    	it('works with correct input', function() {
    	   appTest.obtainArtifactsUrl(127,function(err,res){
                assert(!err)
           });
        });
        it('doesn\'t work when there is no build number', function() {
        	assert.throws(function(){ 
        		appTest.obtainArtifactsUrl(null) 
        	}, Error,'obtainArtifactsUrl allowed no number');
        	assert.throws(function(){ 
        		appTest.obtainArtifactsUrl('127') 
        	}, Error,'obtainArtifactsUrl allowed a string');
        });
    });

    describe('obtainAPKpath', function() {
    	it('works with correct input', function() {
        	 appTest.obtainAPKpath('https://correctUrl.com/test/apk/applicationName.apk',function(err,appPath){
                assert(!err)
                assert(appPath.endsWith('applicationName.apk'),'returned appPath had different app name' + appPath)
           });
        });
        it('doesn\'t work when there is no url', function() {
        	assert.throws(function(){ 
        		appTest.obtainAPKpath(null) 
        	}, Error,'obtainAPKpath allowed a link without \'https://\'');
        	assert.throws(function(){ 
        		appTest.obtainAPKpath('') 
        	}, Error,'obtainAPKpath allowed a link without \'https://\'');
        });
        it('doesn\'t work when there is apk file in the path', function() {
        	assert.throws(function(){ 
        		appTest.obtainAPKpath('https://url.com/test/apk/applicationName.rar') 
        	}, Error,'obtainAPKpath allowed a path with no .apk');
        });
    });

    describe('Download', function() {
        it('downloads sample http file', function(done) {
            appTest.download('http://www.brainjar.com/java/host/test.html',process.cwd() + DOWNLOAD_DIR + '/test.html', LOG_OUTPUT, function(succes){
                assert(succes,"failed to download bing.com, please check internet connectivity");
                done();
            });
        });
        it('doesn\'t work when there is no uri', function() {
            assert.throws(function(){ 
                appTest.download(null,process.cwd() + DOWNLOAD_DIR + '/bing.html', LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
            assert.throws(function(){ 
                appTest.download('',process.cwd() + DOWNLOAD_DIR + '/bing.html', LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
        });
        it('doesn\'t work when there is no file path', function() {
            assert.throws(function(){ 
                appTest.download('https://bing.com/',null, LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
            assert.throws(function(){ 
                appTest.download('https://bing.com/','', LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
        });
    });

    describe('Settings', function(){
        
        it('can load settings', function(done) {
            appTest.loadSettings('/test/settings/correct.json',function(err,res){
                if (err){ throw err}
                assert(res.port);
                assert(res.circle_ci_token);
                assert(res.circle_ci_url);
                assert(res.download_path);
                done();
            });
        });

        it('will default to default port', function(done) {
            appTest.loadSettings('/test/settings/noPort.json',function(err,res){
                if (err){throw err}
                assert(res.port == appTest.DEFAULT_PORT,'default ports didn\' match ' + res.port + ' and ' + appTest.DEFAULT_PORT);
                done();
            });
        });

        it('will default to default download path', function(done) {
            appTest.loadSettings('/test/settings/noPath.json',function(err,res){
                if (err){throw err}
                assert(res.download_path == appTest.DEFAULT_DOWNLOAD_PATH,'default ports didn\' match ' + res.download_path + ' and ' + appTest.DEFAULT_DOWNLOAD_PATH);
                done();
            });
        });

        it('won\'t accept empty settings', function(done) {
            appTest.loadSettings('/test/settings/empty.json',function(err,res){
                if (!err){throw new Error('accepted empty settings file')}
                done();
            });
        });

        it('won\'t accept missing or empty token', function(done) {
            appTest.loadSettings('/test/settings/noToken.json',function(err,res){
                if (!err){throw new Error('accepted settings file without token')}
                done();
            });
        });

        it('won\'t accept missing or empty url', function(done) {
            appTest.loadSettings('/test/settings/noUrl.json',function(err,res){
                if (!err){throw new Error('accepted settings file without url')}
                done();
            });
        });
    });

    after(function() { 
        try {
            remove.removeSync(process.cwd() + DOWNLOAD_DIR);
        } catch (err) {
            console.error(err);
        }
    });

});