'use strict';
var gulp = require('gulp');


gulp.task('docs', function(cb) {
	var jsdoc = require('gulp-jsdoc3');
	
	gulp.src(['./lib/**/*.js'], { read: false })
	.pipe(jsdoc(cb));
});