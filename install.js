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

fs.stat(SETTINGS_FILE_PATH,function(err,stats){
	if(!err){
		console.log('settings.json already exists, not creating a new one.')	
	} else {
		if(err.code == 'ENOENT'){
			console.log('settings.json doesn\'t exist yet, creating a new one.')
			var settingsJson = generateJson('CI_TOKEN','VCS','TEAM','PROJ',3000,'DOWNLOAD_PATH');
			fs.writeFile(SETTINGS_FILE_PATH,settingsJson,function(err){
				if (err){console.log('caught error: ', err)} else {
					console.log('finished writing settings.json');
				}
			});
		} else {
			console.log('caught error:',err)
		} 
	}
});