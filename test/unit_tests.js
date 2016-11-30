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
    	   appTest.appendToken('https://correct.url/');
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
    	   appTest.obtainArtifactsUrl(127);
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
        	var appPath = appTest.obtainAPKpath('https://correctUrl.com/test/apk/applicationName.apk');
        	assert(appPath.endsWith('applicationName.apk'),'returned appPath had different app name' + appPath)
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
        it('downloads bing', function(done) {
            appTest.download('https://bing.com/',process.cwd() + DOWNLOAD_DIR + '/bing.html', LOG_OUTPUT, function(succes){
                assert(succes,"failed to download bing.com");
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

    after(function() { 
        try {
            remove.removeSync(process.cwd() + DOWNLOAD_DIR);
        } catch (err) {
            console.error(err);
        }
    });

});