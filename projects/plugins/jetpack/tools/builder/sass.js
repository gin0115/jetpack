/**
 * External dependencies
 */
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import dartSass from 'sass';
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import log from 'fancy-log';
import prepend from 'gulp-append-prepend';
import rename from 'gulp-rename';
import rtlcss from 'gulp-rtlcss';
import sourcemaps from 'gulp-sourcemaps';

const sass = gulpSass( dartSass );

/**
 * Internal dependencies
 */
import { alwaysIgnoredPaths } from './util';

gulp.task( 'sass:dashboard', function ( done ) {
	log( 'Building Dashboard CSS bundle...' );

	return gulp
		.src( './_inc/client/scss/style.scss' )
		.pipe( sass( { outputStyle: 'compressed' } ) )
		.pipe(
			prepend.prependText( '/* Do not modify this file directly.  It is compiled SASS code. */\n' )
		)
		.pipe( autoprefixer() )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( gulp.dest( './_inc/build' ) )
		.on( 'end', function () {
			log( 'Dashboard CSS finished.' );
			doRTL( 'main', done );
		} );
} );

gulp.task( 'sass:calypsoify', function ( done ) {
	log( 'Building Calypsoify CSS bundle...' );

	return gulp
		.src( './modules/calypsoify/*.scss' )
		.pipe( sass( { outputStyle: 'compressed' } ) )
		.pipe(
			prepend.prependText( '/* Do not modify this file directly.  It is compiled SASS code. */\n' )
		)
		.pipe( autoprefixer() )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( gulp.dest( './modules/calypsoify' ) )
		.on( 'end', function () {
			log( 'Calypsoify CSS finished.' );
			doRTL( 'calypsoify', done );
		} );
} );

gulp.task( 'sass:color-schemes', function ( done ) {
	log( 'Building Color schemes CSS...' );

	const src =
		process.env.GULP_ENV === 'wpcom'
			? '../masterbar/admin-color-schemes/colors/**/*.scss'
			: './modules/masterbar/admin-color-schemes/colors/**/*.scss';
	const dest =
		process.env.GULP_ENV === 'wpcom'
			? '../masterbar/admin-color-schemes/colors'
			: './_inc/build/masterbar/admin-color-schemes/colors';

	return gulp
		.src( src )
		.pipe( sass( { outputStyle: 'compressed' } ) )
		.pipe(
			prepend.prependText( '/* Do not modify this file directly.  It is compiled SASS code. */\n' )
		)
		.pipe( prepend.prependText( '/* NOAUTORTL */\n' ) )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( dest ) )
		.on( 'end', function () {
			log( 'Color Schemes CSS finished.' );
			done();
		} );
} );

// eslint-disable-next-line jsdoc/require-jsdoc
function doRTL( files, done ) {
	let dest = './_inc/build',
		renameArgs = { suffix: '.rtl' },
		path,
		success;

	switch ( files ) {
		case 'main':
			path = './_inc/build/style.min.css';
			success = 'Dashboard RTL CSS finished.';
			break;
		case 'calypsoify':
			path = [ './modules/calypsoify/style*.min.css', '!./modules/calypsoify/style*rtl.min.css' ];
			dest = './modules/calypsoify';
			success = 'Calypsoify RTL CSS finished.';
			renameArgs = function ( pathx ) {
				pathx.basename = pathx.basename.replace( '.min', '' );
				pathx.extname = '-rtl.min.css';
			};
			break;
		default:
			// unknown value, fail out
			return;
	}

	gulp
		.src( path )
		.pipe( rtlcss() )
		.pipe( rename( renameArgs ) )
		.pipe( sourcemaps.init() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( dest ) )
		.on( 'end', function () {
			log( success );
			done();
		} );
}

gulp.task( 'sass:old:rtl', function () {
	return (
		gulp
			.src( 'scss/*.scss' )
			.pipe( sass( { outputStyle: 'expanded' } ) )
			.pipe(
				prepend.prependText(
					'/*!\n' + '* Do not modify this file directly.  It is compiled SASS code.\n' + '*/\n'
				)
			)
			.pipe( autoprefixer() )
			// Build *-rtl.css & sourcemaps
			.pipe( rtlcss() )
			.pipe( rename( { suffix: '-rtl' } ) )
			.pipe( sourcemaps.init() )
			.pipe( sourcemaps.write( './' ) )
			.pipe( rename( { dirname: 'css' } ) )
			.pipe( gulp.dest( './' ) )
			// Build *-rtl.min.css
			.pipe( cleanCSS() )
			.pipe( rename( { suffix: '.min' } ) )
			.pipe( gulp.dest( './' ) )
			// Finished
			.on( 'end', function () {
				log( 'Global admin RTL CSS finished.' );
			} )
	);
} );

gulp.task(
	'sass:old',
	gulp.series( 'sass:old:rtl', function () {
		return (
			gulp
				.src( 'scss/**/*.scss' )
				.pipe( sass( { outputStyle: 'expanded' } ) )
				.pipe(
					prepend.prependText(
						'/*!\n' + '* Do not modify this file directly.  It is compiled SASS code.\n' + '*/\n'
					)
				)
				.pipe( autoprefixer() )
				// Build *.css & sourcemaps
				.pipe( sourcemaps.init() )
				.pipe( sourcemaps.write( './' ) )
				.pipe( rename( { dirname: 'css' } ) )
				.pipe( gulp.dest( './' ) )
				// Build *.min.css & sourcemaps
				.pipe( cleanCSS() )
				.pipe( rename( { suffix: '.min' } ) )
				.pipe( gulp.dest( './' ) )
				.pipe( sourcemaps.write( '.' ) )
				.on( 'end', function () {
					log( 'Global admin CSS finished.' );
				} )
		);
	} )
);

export const build = gulp.parallel(
	gulp.series( 'sass:dashboard', 'sass:calypsoify' ),
	'sass:color-schemes',
	'sass:old'
);

export const watch = function () {
	return gulp.watch(
		[ './**/*.scss', ...alwaysIgnoredPaths ],
		gulp.series( 'sass:dashboard', 'sass:calypsoify', 'sass:color-schemes', 'sass:old' )
	);
};
