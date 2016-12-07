var path = require('path');
var fs = require('fs');

var SETTINGS_FILE_PATH = path.win32.join(process.cwd(),'\\settings.json')

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
	"\" // \"{cwd}\" will be replaced with the current working directory\n}"
}

fs.stat(SETTINGS_FILE_PATH,function(err,stats){
	if(!err){
		console.log('settings.json already exists, not creating a new one.')	
	} else {
		if(err.code == 'ENOENT'){
			console.log('settings.json doesn\'t exist yet, creating a new one.')
			var settingsJson = generateJson(
				"{TOKEN}",
				"{github|bitbucket}",
				"{TEAM_NAME}",
				"{PROJECT_NAME}",
				"{PORT}",
				"{DOWNLOAD_PATH}");
			fs.writeFile(SETTINGS_FILE_PATH,settingsJson,function(err){
				if (err){console.log('caught error: ', err)} else {
					console.log("settings.json:")
					console.log(settingsJson)
					console.log('your settings.json has been created');
				}
			});
		} else {
			console.log('caught error:',err)
		} 
	}
});