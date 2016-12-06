var assert = require('assert');
var download = require('../src/download');

describe('Download', function() {
        it('downloads sample http file', function(done) {
            download.start('http://www.brainjar.com/java/host/test.html',process.cwd() + DOWNLOAD_DIR + '/test.html', LOG_OUTPUT, function(succes){
                assert(succes,"failed to download bing.com, please check internet connectivity");
                done();
            });
        });
        it('doesn\'t work when there is no uri', function() {
            assert.throws(function(){ 
                download.start(null,process.cwd() + DOWNLOAD_DIR + '/bing.html', LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
            assert.throws(function(){ 
                download.start('',process.cwd() + DOWNLOAD_DIR + '/bing.html', LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
        });
        it('doesn\'t work when there is no file path', function() {
            assert.throws(function(){ 
                download.start('https://bing.com/',null, LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
            assert.throws(function(){ 
                download.start('https://bing.com/','', LOG_OUTPUT, function(succes){
                    assert(false,"failed to download bing.com");
                    done();
                });
            }, Error,'download allowed a download without uri');
        });
    });