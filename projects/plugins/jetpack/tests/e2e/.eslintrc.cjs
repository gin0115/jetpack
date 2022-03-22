const loadIgnorePatterns = require( '../../../../../tools/js-tools/load-eslint-ignore.js' );

module.exports = {
	extends: [ require.resolve( 'jetpack-e2e-commons/.eslintrc.cjs' ) ],
	ignorePatterns: loadIgnorePatterns( __dirname ),
};
