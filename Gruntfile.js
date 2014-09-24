/* jshint scripturl:true */
/* global require, module */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'), // read package.json to expose it variables under pkg
        watch: {
            css: {
                files: ['sass/*.scss'],
                tasks: ['compass'],
            },
            script: {
                files: ['js/*.js'],
                tasks: ['build'],
            },
        },

        compass: {
            // dist: {
            //     options: {
            //         config: 'config.rb',
            //         environment: 'production',
            //         force: true, /* overwrite existing/unmodified file */
            //         cssDir: 'css-dist/'
            //     }
            // },
            dev: {
                options: {
                    config: 'config.rb',
                    environment: 'development'
                }
            }
        },

        // uglify: {
        //     dev: {
        //         options: {
        //             beautify: true, // for debugging
        //             mangle: false,
        //             compress: false,
        //             preserveComments: 'all',
        //             sourceMap: true
        //         },
        //         files: {
        //             '_tmp/synergyChrome-dev.js': [
        //                 'js/leave.js',
        //                 'js/psa.js',
        //                 'js/prepare.js'
        //             ]
        //             // Do not export variables
        //         }
        //     },
        //     build: {
        //         files: {
        //             '_tmp/synergyChrome-minified.js': [
        //                 'js/leave.js',
        //                 'js/psa.js',
        //                 'js/prepare.js',
        //                 'js/exports.js'
        //             ]
        //         }
        //     }
        // },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: [
                'js/Gruntfile.js',
                'js/*.js'
            ]
        },


    });

    // Tasks
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', ['jshint']);
};
