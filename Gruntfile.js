/**
*Standard configuration file for all Angular.js projects
*Concats and minifies both the javascript and css files
*and performs a code analysis on the javascript files.
*
*Running this file requires first initializing npm in the
*project's root directory, using the
*command npm init. Follow the instructions to set up the
*package.json file.
*
*Once the package.json file has been created
*run 'npm install grunt-ng-annotate --save-dev',
*'npm install grunt-contrib-uglify --save-dev',
* and 'npm install grunt-contrib-cssmin --save-dev' to
*finish generating the proper package.json file
*for the project'
*/
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//Explicitly add in any necessary annotation while doing the concats
		ngAnnotate: {
			//The controllers and services must follow everything else
			base: {
				files: [
					{
						src: [
							'source/assets/js/modules/**/*.js',
							'!source/assets/js/modules/**/controllers/**/*.js',
              '!source/assets/js/modules/**/services/**/*.js',
              '!source/assets/js/modules/**/directives/**/*.js'
            ],
            dest: 'dist/assets/js/base.js'
          }
				],
			},
			controllers: {
				files: [
					{src: ['source/assets/js/modules/**/controllers/**/*.js'], dest: 'dist/assets/js/controllers.js'}
				],
			},
			services: {
				files: [
					{src: ['source/assets/js/modules/**/services/**/*.js'], dest: 'dist/assets/js/services.js'}
				],
			},
			directives: {
				files: [
					{src: ['source/assets/js/modules/**/directives/**/*.js'], dest: 'dist/assets/js/directives.js'}
				],
			},
			dist: {
				files: [
					{
            src: [
              'dist/assets/js/base.js',
              'dist/assets/js/services.js',
              'dist/assets/js/controllers.js',
              'dist/assets/js/directives.js'
            ],
            dest: 'dist/assets/js/concat.js'
          },
				],
			},
		},
		uglify: {
			options: {
				banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			dist: {
				files: [
					{src: 'dist/assets/js/concat.js', dest: 'dist/assets/js/<%= pkg.name %>.min.js'}
				]
			},
		},
		cssmin: {
			combine: {
				//For some reason, this one is dest then src
				files: {
					'dist/assets/css/<%= pkg.name %>.min.css': [
            'source/assets/css/**/*.css',
            '!source/assets/css/explorer8.css',
            '!source/assets/css/explorer9.css',
            '!source/**/*.min.css']
				},
			},
		},
		ngdocs: {
			options: {
				dest: 'documentation/ngdocs',
			},
			all: ['source/assets/js/modules/**/*.js']
		},
		jsdoc: {
			dist: {
				src: ['source/assets/js/modules/**/*.js'],
				options: {
					destination: 'documentation/jsdoc'
				}
			}
		},
    eslint: {
        target: ['source/assets/js/modules/**/*.js']
    }
	});

	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-ngdocs');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', ['ngAnnotate', 'uglify', 'cssmin', 'ngdocs', 'jsdoc']);
};
