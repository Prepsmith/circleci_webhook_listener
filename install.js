var fs = require('fs');

var SETTINGS_FILE_PATH = process.cwd() + '\\settings.json'
var NEW_SETTINGS_JSON = '{\n\t\"circle_ci_token\": \"{your circleCI token}\",\n\t\"circle_ci_url\": \"https://circleci.com/api/v1.1/project/{vcs}/{team}/{projName}/\",\n\t\"port\": 3000,\n\t\"download_path\": \"{cwd}/downloads\" // {cwd} will be automtaically replaced with current_working_directory\n}'

fs.stat(SETTINGS_FILE_PATH,function(err,stats){
	if(!err){
		console.log('settings.json already exists, not creating a new one.')	
	} else {
		if(err.code == 'ENOENT'){
			console.log('settings.json doesn\'t exist yet, creating a new one.')
			console.log("@",SETTINGS_FILE_PATH)
			fs.writeFile(SETTINGS_FILE_PATH,NEW_SETTINGS_JSON,function(err){
				if (err){console.log('caught error: ', err)} else {
					console.log('finished writing settings.json');
				}
			});
		} else {
			console.log('caught error:',err)
		} 
	}
});