var assert = require('assert');
var apkPath = require('../src/apkPath');

describe('apkPath', function() {
    var downloadPath = process.cwd() + '\\test\\downloads\\'
	it('obtain works with correct input', function() {
    	apkPath.obtain('https://correctUrl.com/test/apk/applicationName.apk',downloadPath,function(err,appPath){
            assert(!err,err)
            assert(appPath,'returned appPath was empty')
            assert(appPath.endsWith('applicationName.apk'),'returned appPath had different app name' + appPath)
       });
    });
    it('obtain doesn\'t work when there is no url', function() {
    	assert.throws(function(){ 
    		apkPath.obtain(null,downloadPath) 
    	}, Error,'obtainAPKpath allowed a link without \'https://\'');
    	assert.throws(function(){ 
    		apkPath.obtain('',downloadPath) 
    	}, Error,'obtainAPKpath allowed a link without \'https://\'');
    });
    it('obtain doesn\'t work when there is apk file in the path', function() {
    	assert.throws(function(){ 
    		apkPath.obtain('https://url.com/test/apk/applicationName.rar',downloadPath) 
    	}, Error,'obtainAPKpath allowed a path with no .apk');
    });
});