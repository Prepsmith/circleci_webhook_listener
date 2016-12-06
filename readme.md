![codeship](https://codeship.com/projects/387de040-9d99-0134-0bb8-5ab174e919b6/status?branch=master)
## CircleCI webhook listener
# install
1.	clone repository
2.	run "npm install"
3.  in root of project add file named "settings.json", example:
```
{
	"circle_ci_token": "{your circleCI token}",
	"circle_ci_url": "https://circleci.com/api/v1.1/project/{vcs}/{team}/{projName}/",
	"port": 3123,
	"download_path": "{cwd}/downloads" // {cwd} will be automtaically replaced with current_working_directory
}
```

# start "node app.js"
# test "npm test"

# license
The MIT License

Copyright (c) 2010-2016 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
