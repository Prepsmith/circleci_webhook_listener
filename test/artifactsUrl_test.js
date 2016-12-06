var assert = require('assert');
var artifactsUrl = require('../src/artifactsUrl');

describe('obtainArtifactsUrl', function() {

    before(function(){
        settings = {}
        settings.circle_ci_url = 'https://testCircle.ci.url/';
    })

	it('works with correct input', function() {
	   artifactsUrl.obtain(127,function(err,res){
            assert(!err,err)
       });
    });
    it('doesn\'t work when there is no build number', function() {
    	assert.throws(function(){ 
    		artifactsUrl.obtain(null) 
    	}, Error,'obtainArtifactsUrl allowed no number');
    	assert.throws(function(){ 
    		artifactsUrl.obtain('127') 
    	}, Error,'obtainArtifactsUrl allowed a string');
    });
});