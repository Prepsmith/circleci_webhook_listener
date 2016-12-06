var assert = require('assert');
var download = require('../src/download');

describe('Download', function() {

    downloadPath = '\\test\\downloads';
    TEST_PREFIX = 'TEST APK'
    it('downloads sample http file', function(done) {
        download.start(TEST_PREFIX, 'http://www.brainjar.com/java/host/test.html',process.cwd() + downloadPath + '/test.html', false, function(succes){
            assert(succes,"failed to download bing.com, please check internet connectivity");
            done();
        });
    });
    it('doesn\'t work when there is no uri', function() {
        assert.throws(function(){ 
            download.start(TEST_PREFIX, null,process.cwd() + downloadPath + '/bing.html', false, function(succes){
                assert(false,"failed to download bing.com");
                done();
            });
        }, Error,'download allowed a download without uri');
        assert.throws(function(){ 
            download.start(TEST_PREFIX, '',process.cwd() + downloadPath + '/bing.html', false, function(succes){
                assert(false,"failed to download bing.com");
                done();
            });
        }, Error,'download allowed a download without uri');
    });
    it('doesn\'t work when there is no file path', function() {
        assert.throws(function(){ 
            download.start(TEST_PREFIX, 'https://bing.com/',null, false, function(succes){
                assert(false,"failed to download bing.com");
                done();
            });
        }, Error,'download allowed a download without uri');
        assert.throws(function(){ 
            download.start(TEST_PREFIX, 'https://bing.com/','', false, function(succes){
                assert(false,"failed to download bing.com");
                done();
            });
        }, Error,'download allowed a download without uri');
    });
});