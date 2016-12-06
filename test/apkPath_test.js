var assert = require('assert');
var apkPath = require('../src/apkPath');

describe('apkPath', function() {
    before(function(){
        settings = {}
        settings.download_path = process.cwd() + '\\test\\downloads';
    });

	it('obtain works with correct input', function() {
    	apkPath.obtain('https://correctUrl.com/test/apk/applicationName.apk',function(err,appPath){
            assert(!err,err)
            assert(appPath,'returned appPath was empty')
            assert(typeof(appPath) == 'string', "returned app path was not a string but " + typeof(appPath))
            assert(appPath.endsWith('applicationName.apk'),'returned appPath had different app name' + appPath)
       });
    });
    it('obtain doesn\'t work when there is no url', function() {
    	assert.throws(function(){ 
    		apkPath.obtain(null) 
    	}, Error,'obtainAPKpath allowed a link without \'https://\'');
    	assert.throws(function(){ 
    		apkPath.obtain('') 
    	}, Error,'obtainAPKpath allowed a link without \'https://\'');
    });
    it('obtain doesn\'t work when there is apk file in the path', function() {
    	assert.throws(function(){ 
    		apkPath.obtain('https://url.com/test/apk/applicationName.rar') 
    	}, Error,'obtainAPKpath allowed a path with no .apk');
    });
});