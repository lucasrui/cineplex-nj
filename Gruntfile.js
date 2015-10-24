module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					levereload: true
				}
			},
			js: {
				files: ['bower_components/**', 'models/**/*.js', 'shcemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
					levereload: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				args: [],
				ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
				watchedExtensions: ['js'],
				watchedFolders: ['./'],
				debug: true,
				delayTime: 1,
				env: {
					PORT: 3000
				},
				cwd: __dirname
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.option('force', true);
	grunt.registerTask('default', ['concurrent']);
};