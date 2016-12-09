![codeship](https://codeship.com/projects/387de040-9d99-0134-0bb8-5ab174e919b6/status?branch=master)
# CircleCI webhook listener
This webhook listener awaits webhook notifications from CircleCI, when a notification is received it downloads the files from CircleCI's artifacts folder.
![CircleCIflow](https://github.com/Prepsmith/circleci_webhook_listener/blob/issue_11_documentation/docs/CircleCI%20flow.png)

## install
1.	clone repository
2.	navigate to root of repository
3.	run "npm install"

## start
1.	navigate to root of repository
2.	setup CircleCI
3.	setup settings.json
4.	run "npm start"

## test 
1.	navigate to root of repository
2.	run "npm test"

## setting up circleCI
in your circle.yml file add the following lines
```
notify:
  webhooks:
    - url: {yourWebHookAddress}:{portWebHookListener}/webhook
```
in your circle.yml file write a copy command for all the files that need to be downloaded, to the $CIRCLE_ARTIFACTS directory, after the lines that build your project. For example and android project:
```
test:
  override:
      - ./gradlew build
      - cp -r app/build/outputs/apk $CIRCLE_ARTIFACTS
```
**note: circle.yml only takes 2 spaces, not tabs**

## settings up settings.json
### circle_ci_token: 

This is where you place your API token, this can be obtained by going to circleci -> project settings -> API permissions (if needed-> click "Create Token")
	"circle_ci_token": "ABCDEFGHIJKLMNOPQRTSUVWXY123"

### circle_ci_url:

This is the URL of your circleCI project, it should have this format,
```
	"circle_ci_url": "https://circleci.com/api/v1.1/project/{VCS}/{TEAM_NAME}/{PROJECT_NAME}/.
```
*	VCS is the Version Control System used for this project, can either be "github" or "bitbucket"
*	TEAM_NAME is the name of the team this project was created under on CircleCI.
*	PROJECT_NAME is the name of the project on CircleCI.

TEAM_NAME and PROJECT_NAME can be found when browsing to your project on CircleCI and looking at the url, it should a format like this: "https://circleci.com/gh/{TEAM_NAME}/{PROJECT_NAME}"

### hostName:
This is the hostname the webhook listener will listen to, if null or not present it will listen to all addresses on the given port.

### port:

This is the port that the webhook listener will listen to, this is the same port that you have to enter in the circle.yml file in the line {yourWebHookAddress}:{thisPort}/webhook

### download_path:

This is the path the webhook listener will download the obtained artifacts to. You can use "{cwd}", this will be replaced with the root directory of the webhook listener project, for example:
```
"download_path": "{cwd}/downloads/"
"download_path": "C:\\Users\\ThimoVSS\\circleCIArtifacts"
```

## deploying from the ci

example with codeship:

Setup environment to have $BOTNAME and $TARGETHOST in environment variables

```
npm pack
PACKAGE=`ls circleci_webhook_listener-*.tgz`
REMOTE_EXEC="ssh $BOTNAME@$TARGETHOST -C"
scp $PACKAGE $BOTNAME@$TARGETHOST:apps/circleci_webhook_listener/releases/
$REMOTE_EXEC mkdir -p apps/circleci_webhook_listener/releases/ apps/circleci_webhook_listener/current apps/circleci_webhook_listener/shared
$REMOTE_EXEC "cd apps/circleci_webhook_listener/current; cnpm install --production ../releases/$PACKAGE"
$REMOTE_EXEC "cd apps/circleci_webhook_listener/current; ln -sf ../shared/settings.json"
```

## setup service

use:

https://github.com/nicokaiser/node-monit
