/**
 * External dependencies
 */
import { addQueryArgs } from '@wordpress/url';

export const getVideoPressUrl = (
	guid,
	{
		autoplay,
		controls,
		loop,
		muted,
		playsinline,
		poster,
		preload,
		seekbarColor,
		seekbarPlayedColor,
		seekbarLoadingColor,
	}
) => {
	if ( ! guid ) {
		return null;
	}

	// In order to have a cleaner URL, we only set the options differing from the default VideoPress player settings:
	// - Autoplay: Turned off by default.
	// - Controls: Turned on by default.
	// - Loop: Turned off by default.
	// - Muted: Turned off by default.
	// - Plays Inline: Turned off by default.
	// - Poster: No image by default.
	// - Preload: None by default.
	const options = {
		resizeToParent: true,
		...( autoplay && { autoPlay: true } ),
		...( ! controls && { controls: false } ),
		...( loop && { loop: true } ),
		...( muted && { muted: true, persistVolume: false } ),
		...( playsinline && { playsinline: true } ),
		...( poster && { posterUrl: poster } ),
		...( preload !== 'none' && { preloadContent: preload } ),
		...( seekbarColor !== '' && { sbc: seekbarColor } ),
		...( seekbarPlayedColor !== '' && { sbpc: seekbarPlayedColor } ),
		...( seekbarLoadingColor !== '' && { sblc: seekbarLoadingColor } ),
	};
	return addQueryArgs( `https://videopress.com/v/${ guid }`, options );
};
