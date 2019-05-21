[![CircleCI](https://circleci.com/gh/LD4P/sinopia_profile_editor.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_profile_editor)
[![Coverage Status](https://coveralls.io/repos/github/LD4P/sinopia_profile_editor/badge.svg)](https://coveralls.io/github/LD4P/sinopia_profile_editor)

NOTE:  tests fail intermittently, both on local environments and in circleci.
The test failures are not the same each time - re-running tests locally and in circleci may be necessary to get a green build.

# LD4P's BIBFRAME Profile Editor

forked from https://github.com/lcnetdev/profile-edit

## Overview
From lcnetdev description:  "The BIBFRAME Profile Editor was designed to work on the widest range of machines possible. As such, most of the business logic is implemented client-side in JavaScript. This code can run in Chrome, FireFox, IE 8+, and Safari. The AngularJS framework used is the latest in client-side MVC architecture, and provides a clear model for structuring and organizing code. Every effort has been made to follow this structure and document the code, making future modifications as easy as possible.
All of the JavaScript code comes with comments explaining what each bit does. Documentation tools were used to generate documentation for this part of the application automatically. This documentation is available in /source/documentation/jsdoc/. It is also viewable from the web interface at /documentation/jsdoc/. The Editor also contains a help link containing a FAQ section."

# Sinopia Profile Editor
Technical documentation specific to the Sinopia Profile Editor may also be found in the [wiki](https://github.com/LD4P/sinopia_profile_editor/wiki/Sinopia-Profile-Editor).

## Installation (without docker image)

### Prerequisites
* [`node.js`](https://nodejs.org/en/download/) JavaScript runtime
  * [`npm`](https://www.npmjs.com/) JavaScript package manager

### Installation Instructions
1.  Install [node.js](https://nodejs.org/en/download/), which includes [npm](https://www.npmjs.com/)
4.  Get latest npm: `npm install -g npm@latest`
5.  Run `npm install`. This installs everything needed for the build to run successfully.
6.  Run `grunt` to build the code and jsdocs and ngdocs.  Run `npm run grunt-dev` to build the code and not bother with the docs.

## Running the Profile Editor

(`npm start`)

Follow installation instructions, then run `node server.js` or `npm start`.  This will start up the profile editor at http://localhost:8000

## Developers

- See `package.json` for npm package dependencies.
- The javascript code uses the [AngularJS framework](https://angularjs.org/).
- The web server used is `express` web framework for node.js

### Build with grunt

The javascript code uses grunt as a build tool. See `Gruntfile.js` for build dependencies and configuration.

- To build the code and create jsdocs or ngdocs, `grunt` or `npm run grunt`
- To build the code without creating jsdocs or ngdocs, `npm run grunt-dev`

### Linter for JavaScript

`npm run eslint`

### test

Tests are written in jest, also utilizing puppeteer for end-to-end tests.  Be
sure to run `npm install && grunt` before running the tests with `npm test`.

NOTE:  tests fail intermittently, both on local environments and in circleci.
The test failures are not the same each time - re-running tests locally and in circleci may be necessary to get a green build.

#### test coverage
To get coverage data, `npm run test-cov`.  Use a web browser to open `coverage/lcov-report/index.html`.  There is a project view and also a view of each file.  You can also check [coveralls](https://coveralls.io/repos/github/LD4P/sinopia_profile_editor)

### continuous integration

We use [circleci](https://circleci.com/gh/Ld4p/sinopia_profile_editor).  The steps are in `.circleci/config.yml`.

In the "artifacts" tab of a particular build, you can look at code coverage (`coverage/lcov-report/index.html`).

### Using Docker

The Sinopia Profile Editor supports [Docker](https://www.docker.com/), both
with images hosted on [Dockerhub](https://hub.docker.com/r/ld4p/sinopia_profile_editor/)
and with an available Dockerfile to build locally.

#### Running latest Dockerhub Image
To run the Docker image, first download the latest image by
`docker pull ld4p/sinopia_profile_editor:latest` and then to run the profile editor locally
in the foreground, `docker run -p 8000:8000 --rm --name=sinopia_profile_editor ld4p/sinopia_profile_editor`. The running Sinopia Profile Editor should now be available locally at
http://localhost:8000.

#### Building latest Docker Image

Before building the latest Docker Image, run
```
grunt ngAnnotate uglify cssmin
```

to update the `dist` folder with the current build.

To build the latest version of the Sinopia Profile Editor, you can build with the `docker build -t ld4p/sinopia_profile_editor:latest --no-cache=true .` command.

#### Pushing Docker Image to DockerHub

Run `docker login` and enter the correct credentials to your docker account (hub.docker.com).  
Once successfully authenticated, run

```
docker push ld4p/sinopia_profile_editor:latest
```

Ask a member on the DevOps team to go into the AWS console to update https://sinopia.io

#### Updating Docker Image in AWS Dev Environment

This section assumes you've already authenticated to DockerHub via `docker login` in the previous section, and also assumes you've run through the [AWS development environment setup](https://github.com/sul-dlss/terraform-aws/wiki/AWS-DLSS-Dev-Env-Setup) documentation and configured the AWS CLI.

First, build a new `sinopia_profile_editor` image tagged with `latest` per instructions above.

Then push the `latest`-tagged image to DockerHub per instructions above.

Next, set an environment variable to the name of the AWS `DevelopersRole` profile as described in the documentation above (as stored in `~/.aws/config`):

```shell
$ export AWS_PROFILE=change_to_whatever_you_named_your_dlss_development_profile
```

And, finally, run the following commands to refresh the dev ECS instance that runs the profile editor:

```shell
$ task_arn=$(aws ecs list-task-definitions --family-prefix sinopia-pe --region us-west-2 --sort DESC --max-items 1 --profile $AWS_PROFILE | jq --raw-output --exit-status '.taskDefinitionArns[]')
$ cluster_arn=$(aws ecs list-clusters --region us-west-2  --profile $AWS_PROFILE | jq --raw-output --exit-status '.clusterArns[] | select(contains(":cluster/sinopia-dev"))')
$ aws ecs update-service --service sinopia-pe --region us-west-2 --cluster $cluster_arn --task-definition $task_arn --force-new-deployment --profile $AWS_PROFILE
```

# lcnetdev info below

## Data References

Profiles, templates, properties, vocabularies, and ontologies are all stored in the "config" database in Verso.

## Acknowledgements

Thank you [IndexData](http://indexdata.com/) for your assistance on the latest build!

Contributors:
* [Kirk Hess](https://github.com/kirkhess)
* [Charles Ledvina](https://github.com/cledvina)
* [Wayne Schneider](https://github.com/wafschneider)

## License
Original source code created by Stanford University is copyrighted under Apache 2 license and
documented with an Apache 2.0 license header.

The Profile Editor was originally a work of the United States government; portions of the project are in the public domain through the CC0 1.0 Universal public domain dedication license.
