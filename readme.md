![codeship](https://codeship.com/projects/387de040-9d99-0134-0bb8-5ab174e919b6/status?branch=master)
# CircleCI webhook listener
## install
1.	clone repository
2.	navigate to root of repository
3.	run "npm install"

## start
1.	fill in correct settings in settings.json
2.	navigate to root of repository
3.	run "node app.js"

## test 
1.	navigate to root of repository
2.	run "npm test"

## deploying from the ci

example with codeship:

Setup environment to have $BOTNAME and $TARGETHOST in environment variables

```
cd clone/
npm pack

PACKAGE=`ls circleci_webhook_listener-*.tgz`
REMOTE_EXEC="ssh $BOTNAME@$TARGETHOST -C"

scp $PACKAGE $BOTNAME@$TARGETHOST:apps/circleci_webhook_listener/releases/

$REMOTE_EXEC mkdir -p apps/circleci_webhook_listener/releases/ apps/circleci_webhook_listener/current apps/circleci_webhook_listener/shared

$REMOTE_EXEC "cd apps/circleci_webhook_listener/current; cnpm install --production ../releases/$PACKAGE"

$REMOTE_EXEC "cd apps/circleci_webhook_listener/current; ln -s ../shared/settings.json" 
```

## setup service

use:

https://github.com/nicokaiser/node-monit