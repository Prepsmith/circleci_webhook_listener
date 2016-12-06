var assert = require('assert');
var appTest = require('../app.js');
var remove = require('remove');
var fs = require('fs');

var DOWNLOAD_DIR = '\\test\\downloads'
var LOG_OUTPUT = false

var ENTRY_EXISTS = 'EEXIST'

describe('WebHook unit tests', function() {

    before(function(done){
        fs.mkdir(process.cwd() + DOWNLOAD_DIR, null , function(err) {
            if (err && err.code != ENTRY_EXISTS){console.log('caught error:' , err)}
            done();
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