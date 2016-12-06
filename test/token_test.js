var assert = require('assert');
var token = require('../src/token');

describe('AppendToken', function() {

    before(function(){
        settings = {}
        settings.circle_ci_token = 'TEST_TOKEN';
    })

	it('works with correct input', function() {
	   token.append('https://correct.url/',function(err,res){
            assert(!err,err)
       });
    });
    it('doesn\'t work when there is no https', function() {
    	assert.throws(function(){ 
    		token.append('missing https in url') 
    	}, Error,'appendToken allowed a link without \'https://\'');
    });
    it('doesn\'t work when there is no url', function() {
    	assert.throws(function(){ 
    		token.append(null) 
    	}, Error,'appendToken allowed a link without \'https://\'');
    	assert.throws(function(){ 
    		token.append('') 
    	}, Error,'appendToken allowed a link without \'https://\'');
    });
});