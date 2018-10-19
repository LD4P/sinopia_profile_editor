[![CircleCI](https://circleci.com/gh/LD4P/sinopia_profile_editor.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_profile_editor)
[![Coverage Status](https://coveralls.io/repos/github/LD4P/sinopia_profile_editor/badge.svg)](https://coveralls.io/github/LD4P/sinopia_profile_editor)

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
6.  Run `grunt` to build the code and jsdocs and ngdocs.

## Running the code

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

#### Generate a list of all eslint errors

```
npx eslint-takeoff
```

creates `.eslintrc-todo.yml` showing which linter rules give errors or warnings for each javascript file, per `.eslintrc.yml`

See https://www.npmjs.com/package/eslint-takeoff for more info.

### test

Tests are written in jest, also utilizing puppeteer for end-to-end tests.  Be
sure to run `npm install && grunt` before running the tests with `npm test`.

#### test coverage
To get coverage data, `npm run test-cov`.  Use a web browser to open `coverage/lcov-report/index.html`.  There is a project view and also a view of each file.  You can also check [coveralls](https://coveralls.io/repos/github/LD4P/sinopia_profile_editor)

### static analysis

We use plato (actually es6-plato) to get static analysis info such as code complexity, etc.  `npm run analysis` will create a folder `static-analysis`; use a web browser to open `static-analysis/index.html`.  There is a project view and also a view of each file.

### continuous integration

We use [circleci](https://circleci.com/gh/Ld4p/sinopia_profile_editor).  The steps are in `.circleci/config.yml`.

In the "artifacts" tab of a particular build, you can look at code coverage (`coverage/lcov-report/index.html`) and at static analysis output (`static-analysis/index.html`).

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

As a work of the United States government, this project is in the public domain within the United States.

Additionally, we waive copyright and related rights in the work worldwide through the CC0 1.0 Universal public domain dedication.
