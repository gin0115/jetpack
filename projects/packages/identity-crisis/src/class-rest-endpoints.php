<?php
/**
 * Identity_Crisis package.
 *
 * @package  automattic/jetpack-identity-crisis
 */

namespace Automattic\Jetpack\IdentityCrisis;

use Jetpack_Options;
use WP_Error;
use WP_REST_Server;

/**
 * This class will handle Identity Crisis Endpoints
 *
 * @since 9.8.0
 */
class REST_Endpoints {

	/**
	 * Initialize REST routes.
	 */
	public static function initialize_rest_api() {

		// Confirm that a site in identity crisis should be in staging mode.
		register_rest_route(
			'jetpack/v4',
			'/identity-crisis/confirm-safe-mode',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => __CLASS__ . '::confirm_safe_mode',
				'permission_callback' => __CLASS__ . '::identity_crisis_mitigation_permission_check',
			)
		);

		// Handles the request to migrate stats and subscribers during an identity crisis.
		register_rest_route(
			'jetpack/v4',
			'identity-crisis/migrate',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => __CLASS__ . '::migrate_stats_and_subscribers',
				'permission_callback' => __CLASS__ . '::identity_crisis_mitigation_permission_check',
			)
		);

	}

	/**
	 * Handles identity crisis mitigation, confirming safe mode for this site.
	 *
	 * @since 4.4.0
	 *
	 * @return bool | WP_Error True if option is properly set.
	 */
	public static function confirm_safe_mode() {
		$updated = Jetpack_Options::update_option( 'safe_mode_confirmed', true );
		if ( $updated ) {
			return rest_ensure_response(
				array(
					'code' => 'success',
				)
			);
		}

		return new WP_Error(
			'error_setting_jetpack_safe_mode',
			esc_html__( 'Could not confirm safe mode.', 'jetpack' ),
			array( 'status' => 500 )
		);
	}

	/**
	 * Handles identity crisis mitigation, migrating stats and subscribers from old url to this, new url.
	 *
	 * @since 4.4.0
	 *
	 * @return bool | WP_Error True if option is properly set.
	 */
	public static function migrate_stats_and_subscribers() {
		if ( Jetpack_Options::get_option( 'sync_error_idc' ) && ! Jetpack_Options::delete_option( 'sync_error_idc' ) ) {
			return new WP_Error(
				'error_deleting_sync_error_idc',
				esc_html__( 'Could not delete sync error option.', 'jetpack' ),
				array( 'status' => 500 )
			);
		}

		if ( Jetpack_Options::get_option( 'migrate_for_idc' ) || Jetpack_Options::update_option( 'migrate_for_idc', true ) ) {
			return rest_ensure_response(
				array(
					'code' => 'success',
				)
			);
		}
		return new WP_Error(
			'error_setting_jetpack_migrate',
			esc_html__( 'Could not confirm migration.', 'jetpack' ),
			array( 'status' => 500 )
		);
	}

	/**
	 * Verify that user can mitigate an identity crisis.
	 *
	 * @since 4.4.0
	 *
	 * @return bool Whether user has capability 'jetpack_disconnect'.
	 */
	public static function identity_crisis_mitigation_permission_check() {
		if ( current_user_can( 'jetpack_disconnect' ) ) {
			return true;
		}
		$error_msg = esc_html__(
			'You do not have the correct user permissions to perform this action.
			Please contact your site admin if you think this is a mistake.',
			'jetpack'
		);

		return new WP_Error( 'invalid_user_permission_identity_crisis', $error_msg, array( 'status' => rest_authorization_required_code() ) );
	}

}
