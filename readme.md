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

```
cd clone/
npm pack
PACKAGE=`ls pad_sales_tool_webhook-*.tgz`
scp $PACKAGE deployer@cms.staging.prepsmith.com:
npm install --production $PACKAGE
```

cnpm install  ./pad_sales_tool_webhook-1.0.0.tgz