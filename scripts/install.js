var path = require('path');
var fs = require('fs');
var path = require('path');

var SETTINGS_FILE_PATH = path.join(process.cwd(),'settings.json');

var generateJson = function(ciToken,vcs,team,projName,hostName,port,downloadPath){
	return '{\n\t\"circle_ci_token\": \"' + 
	ciToken +
	'\",\n\t\"circle_ci_url\": \"https://circleci.com/api/v1.1/project/' +
	vcs + 
	'/' +
	team +
	'/' +
	projName +
	'/\",\n\t\"hostName\": \"' + 
	hostName +
	'\",\n\t\"port\": ' +
	port +
	',\n\t\"download_path\": \"' +
	downloadPath +
	"\"\n}"
}

fs.stat(SETTINGS_FILE_PATH,function(err,stats){
	if(!err){
		console.log('settings.json found.')
		return;
	}
	if(err.code != 'ENOENT'){
		throw err
		return;
	}
	var settingsJson = generateJson(
		"{TOKEN}",
		"{github|bitbucket}",
		"{TEAM_NAME}",
		"{PROJECT_NAME}",
		"{HOSTNAME}",
		"{PORT}",
		"{DOWNLOAD_PATH}");
	throw new Error('settings.json was not found, create a new one:\n' + settingsJson);
});