// Load our plugins
var gulp 			= require('gulp'),
	sass			= require('gulp-sass'),  // Our sass compiler
	browserSync		= require('browser-sync'), // Sends php, js, and css updates to browser for us
	uglify			= require('gulp-uglify'),
	imagemin 		= require('gulp-imagemin'), //MRo
	cache 			= require('gulp-cache'), //MRo
	del				= require('del'),
	autoprefixer	= require('gulp-autoprefixer'), // Adds vendor prefixes for us
	sourcemaps		= require('gulp-sourcemaps'), // Sass sourcemaps
	notify			= require('gulp-notify'), // Basic gulp notificatin using OS
	svgSprite		= require('gulp-svg-sprite'),
	svgmin 			= require('gulp-svgmin'),
	size			= require('gulp-size'),
	concat			= require('gulp-concat'), // Concat our js
	babel			= require('gulp-babel'); //MRo: not really used


////////////////////////////////////////////////////////////////////////////////
// Path Configs
////////////////////////////////////////////////////////////////////////////////

var paths = {
	sassPath: 'sass/',
	nodePath: 'node_modules/',
	// jsPath: 'assets/js/concat',
	// destPath: 'assets/dist/',
	destPath: 'css/',
	// isotopePath: 'node_modules/isotope-layout/dist/',
	// imagesLoadedPath: 'node_modules/imagesloaded/',
	// imgPath: 'assets/img/'
};

var bsProxy = 'mundocomm.test';


////////////////////////////////////////////////////////////////////////////////
// SVG Sprite Task
////////////////////////////////////////////////////////////////////////////////

// Delete compiled SVGs before creating a new one
// gulp.task('clean:svgs', function () {
//   return del([
// 		paths.destPath + 'svg/**/*',
// 		paths.destPath + 'sprite/sprite.svg',
// 	]);
// });

// var svgConfig = {
//   mode: {
//     symbol: { // symbol mode to build the SVG
//       dest: 'sprite', // destination foldeer
//       sprite: 'sprite.svg', //sprite name
//       example: true // Build sample page
//     }
//   },
//   svg: {
//     xmlDeclaration: false, // strip out the XML attribute
//     doctypeDeclaration: false, // don't include the !DOCTYPE declaration
// 		rootAttributes: { // add some attributes to the <svg> tag
//       width: 0,
//       height: 0,
//       style: 'position: absolute;',
//      }
//   }
// };

// gulp.task('svg-min', ['clean:svgs'], function() {
//   return gulp.src(paths.imgPath + 'svg/**/*.svg')
// 		.pipe(svgmin())
// 		.pipe(gulp.dest(paths.destPath + 'svg'))
// 		.pipe(notify({
// 			message: "SVG Minify task complete",
// 			onLast: true
// 		}));
// });

// gulp.task('svg-sprite', ['svg-min'], function() {
//   return gulp.src([
// 		paths.imgPath + 'svg/*.svg'
// 	])
//     .pipe(svgSprite(svgConfig))
//     .pipe(gulp.dest(paths.destPath))
// 		.pipe(browserSync.reload({stream:true}))
// 		.pipe(notify({ message: "SVG Sprite task complete"}));
// });


////////////////////////////////////////////////////////////////////////////////
// Optimize Images Task (MRo)
////////////////////////////////////////////////////////////////////////////////

// gulp.task('optimize-images', function(){
//   return gulp.src(paths.imgPath + 'raster/**/*.+(png|jpg|gif)')
//   // Caching images that ran through imagemin
//   .pipe(cache(imagemin({
//       interlaced: true
//     })))
//   .pipe(gulp.dest(paths.destPath + 'img'))
// });


////////////////////////////////////////////////////////////////////////////////
// Our browser-sync task
////////////////////////////////////////////////////////////////////////////////

gulp.task('browser-sync', function() {
	var files = [
		'**/*.php'
	];

	browserSync.init(files, {
		proxy: bsProxy
	});
});


////////////////////////////////////////////////////////////////////////////////
// Styles - Sass
////////////////////////////////////////////////////////////////////////////////

gulp.task('styles', function() {
	gulp.src(paths.sassPath + '**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', notify.onError(function(error) {
			return "Error: " + error.message;
		}))
		)
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(size({showFiles: true}))
		.pipe(gulp.dest(paths.destPath + 'css')) // Location of our app.css file
		.pipe(browserSync.stream({match: '**/*.css'}))
		.pipe(notify({
			message: "✔︎ Styles task complete",
			onLast: true
		}));
});


////////////////////////////////////////////////////////////////////////////////
// JS
////////////////////////////////////////////////////////////////////////////////

// gulp.task('js', function() {
// 	return gulp.src(paths.jsPath + '**/*.js')
// 		.pipe(concat('app.js'))
// 		.pipe(gulp.dest(paths.destPath + 'js'))
// 		.pipe(uglify().on('error', notify.onError(function(error) {
// 			return "Error: " + error.message;
// 			}))
// 		)
// 		.pipe(gulp.dest(paths.destPath + 'js'))
// 		.pipe(browserSync.reload({stream:true}))
// 		.pipe(notify({ message: "✔︎ Scripts task complete!"}));
// });


////////////////////////////////////////////////////////////////////////////////
// Foundation JS task, which gives us flexibility to choose what plugins we want
////////////////////////////////////////////////////////////////////////////////

// gulp.task('isotope-js', function() {
// 	return gulp.src([
// 		paths.isotopePath + 'isotope.pkgd.min.js',
// 		paths.imagesLoadedPath + 'imagesloaded.pkgd.min.js',
// 	])
// 	.pipe(gulp.dest(paths.destPath + 'js'));
// });


////////////////////////////////////////////////////////////////////////////////
// Watch our files and fire off a task when something changes
////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function() {
	gulp.watch(paths.sassPath + '**/*.scss', ['styles']);
	// gulp.watch(paths.jsPath + '**/*.js', ['js']);
	// gulp.watch(paths.imgPath + 'svg/**/*.svg', ['svg-sprite']);
	// gulp.watch(paths.imgPath + 'raster/**/*.+(png|jpg|gif)', ['optimize-images']);
});


// Our default gulp task, which runs all of our tasks upon typing in 'gulp' in Terminal
// gulp.task('default', ['styles', 'js', 'svg-sprite', 'optimize-images']);
// gulp.task('serve', ['svg-sprite', 'optimize-images', 'styles', 'js', 'browser-sync', 'isotope-js', 'watch']);
gulp.task('default', ['styles']);
gulp.task('serve', ['styles', 'watch']);
