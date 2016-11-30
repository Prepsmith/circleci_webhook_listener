## CircleCI webhook listener

# install
1.	clone repository
2.	run "npm install"
3.  in root of project add file named "settings.json", example:
```
{
	"circle_ci_token": "{your circleCI token}",
	"circle_ci_url": "https://circleci.com/api/v1.1/project/{vcs}/{team}/{projName}/",
	"port": 3123
}
```

# start "node app.js"
# test "npm test"
