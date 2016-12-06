var prompt = require('prompt');
var fs = require('fs');

var SETTINGS_FILE_PATH = process.cwd() + '\\settings.json'

var generateJson = function(ciToken,vcs,team,projName,port,downloadPath){
	return '{\n\t\"circle_ci_token\": \"' + 
	ciToken +
	'\",\n\t\"circle_ci_url\": \"https://circleci.com/api/v1.1/project/' +
	vcs + 
	'/' +
	team +
	'/' +
	projName +
	'/\",\n\t\"port\": ' +
	port +
	',\n\t\"download_path\": \"' +
	downloadPath +
	"\"\n}"
}

var promptUser = function(callback){

	var properties = [
	    {
		    name: 'token',
	    	description: 'Please enter your CircleCI token.',
	    	type: 'string',
        	required: true
	    },
	    {
		    name: 'vcs',
	    	description: 'Version control system, can either be github or bitbucket.',
			validator: /github|bitbucket/,
			warning: "can only be \"github\" or \"bitbucket\"",
        	required: true
	    },
	    {
		    name: 'team',
	    	description: 'Team name of the circle ci project.',
	    	type: 'string',
        	required: true
	    },
	    {
		    name: 'projName',
	    	description: 'Project name of the circle ci project.',
	    	type: 'string',
        	required: true
	    },
	    {
		    name: 'port',
	    	description: 'What port to launch the webhook listener on, default is 3000.',
	    	type: 'number', 
        	required: true,
        	default: 3000
	    },
	    {
		    name: 'downloadPath',
	    	description: 'Where to store downloaded artifacts, {cwd} will be replaced with the working directory of the project.',
	    	type: 'string',
        	required: true
	    }
	];
	prompt.start();
	prompt.get(properties, function (err, result) {
	    callback(err,result)
	});
}

fs.stat(SETTINGS_FILE_PATH,function(err,stats){
	if(!err){
		console.log('settings.json already exists, not creating a new one.')	
	} else {
		if(err.code == 'ENOENT'){
			console.log('settings.json doesn\'t exist yet, creating a new one.')
			promptUser(function(err,res){
				var settingsJson = generateJson(res.token,res.vcs,res.team,res.projName,res.port,res.downloadPath);
				fs.writeFile(SETTINGS_FILE_PATH,settingsJson,function(err){
					if (err){console.log('caught error: ', err)} else {
						console.log("settings.json:")
						console.log(settingsJson)
						console.log('your settings.json has been created');
					}
				});
			});
		} else {
			console.log('caught error:',err)
		} 
	}
});