/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Context from '../_inc/context';

export default function Edit() {
	return (
		<Context.Consumer>
			{ ( { selectedTab, stripeNudge } ) => (
				/** @see https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/no-static-element-interactions.md#case-the-event-handler-is-only-being-used-to-capture-bubbled-events */
				// eslint-disable-next-line
				<div hidden={ selectedTab.id === 'premium' } className={ selectedTab.className }>
					{ stripeNudge }
					<InnerBlocks
						templateLock={ false }
						templateInsertUpdatesSelection={ false }
						template={ [
							[ 'core/heading', { content: __( 'Subscribe to get access', 'jetpack' ), level: 3 } ],
							[
								'core/paragraph',
								{
									content: __( 'Read more of this content when you subscribe today.', 'jetpack' ),
								},
							],
							[ 'premium-content/buttons' ],
						] }
					/>
				</div>
			) }
		</Context.Consumer>
	);
}
