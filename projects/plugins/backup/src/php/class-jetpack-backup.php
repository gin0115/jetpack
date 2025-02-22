<?php
/**
 * Primary class file for the Jetpack Backup plugin.
 *
 * @package automattic/jetpack-backup-plugin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Automattic\Jetpack\Admin_UI\Admin_Menu;
use Automattic\Jetpack\Assets;
use Automattic\Jetpack\Connection\Initial_State as Connection_Initial_State;
use Automattic\Jetpack\Connection\Manager as Connection_Manager;
use Automattic\Jetpack\Connection\Rest_Authentication as Connection_Rest_Authentication;
use Automattic\Jetpack\My_Jetpack\Initializer as My_Jetpack_Initializer;
use Automattic\Jetpack\Status;

/**
 * Class Jetpack_Backup
 */
class Jetpack_Backup {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Set up the REST authentication hooks.
		Connection_Rest_Authentication::init();

		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

		$page_suffix = Admin_Menu::add_menu(
			__( 'Jetpack Backup', 'jetpack-backup' ),
			_x( 'Backup', 'The Jetpack Backup product name, without the Jetpack prefix', 'jetpack-backup' ),
			'manage_options',
			'jetpack-backup',
			array( $this, 'plugin_settings_page' ),
			99
		);
		add_action( 'load-' . $page_suffix, array( $this, 'admin_init' ) );

		// Init Jetpack packages and ConnectionUI.
		add_action(
			'plugins_loaded',
			function () {
				$config = new Automattic\Jetpack\Config();
				// Connection package.
				$config->ensure(
					'connection',
					array(
						'slug'     => JETPACK_BACKUP_PLUGIN_SLUG,
						'name'     => JETPACK_BACKUP_PLUGIN_NAME,
						'url_info' => JETPACK_BACKUP_PLUGIN_URI,
					)
				);
				// Sync package.
				$config->ensure( 'sync' );

				// Identity crisis package.
				$config->ensure( 'identity_crisis' );
			},
			1
		);

		// Add "Settings" link to plugins page.
		add_filter(
			'plugin_action_links_' . JETPACK_BACKUP_PLUGIN_FOLDER . '/jetpack-backup.php',
			function ( $actions ) {
				$settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=jetpack-backup' ) ) . '">' . __( 'Settings', 'jetpack-backup' ) . '</a>';
				array_unshift( $actions, $settings_link );

				return $actions;
			}
		);

		add_action( 'plugins_loaded', array( $this, 'maybe_upgrade_db' ), 20 );

		My_Jetpack_Initializer::init();
	}

	/**
	 * Initialize the admin resources.
	 */
	public function admin_init() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
	}

	/**
	 * Checks current version against version in code and run upgrades if we are running a new version
	 */
	public function maybe_upgrade_db() {
		$current_db_version = get_option( 'jetpack_backup_db_version' );
		if ( version_compare( $current_db_version, JETPACK_BACKUP_DB_VERSION, '<' ) ) {
			update_option( 'jetpack_backup_db_version', JETPACK_BACKUP_DB_VERSION );
			Jetpack_Backup_Upgrades::upgrade();
		}
	}

	/**
	 * Enqueue plugin admin scripts and styles.
	 */
	public function enqueue_admin_scripts() {
		$status  = new Status();
		$manager = new Connection_Manager( 'jetpack-backup' );

		Assets::register_script(
			'jetpack-backup',
			'build/index.js',
			JETPACK_BACKUP_PLUGIN_ROOT_FILE,
			array(
				'in_footer'  => true,
				'textdomain' => 'jetpack-backup',
			)
		);
		Assets::enqueue_script( 'jetpack-backup' );
		// Initial JS state including JP Connection data.
		wp_add_inline_script( 'jetpack-backup', $this->get_initial_state(), 'before' );
		wp_add_inline_script( 'jetpack-backup', Connection_Initial_State::render(), 'before' );

		// Load script for analytics.
		if ( ! $status->is_offline_mode() && $manager->is_connected() ) {
			wp_enqueue_script( 'jp-tracks', '//stats.wp.com/w.js', array(), gmdate( 'YW' ), true );
		}
	}

	/**
	 * Main plugin settings page.
	 */
	public function plugin_settings_page() {
		?>
			<div id="jetpack-backup-root"></div>
		<?php
	}

	/**
	 * Return the rendered initial state JavaScript code.
	 *
	 * @return string
	 */
	private function get_initial_state() {
		require_once JETPACK_BACKUP_PLUGIN_DIR . '/src//php/class-initial-state.php';
		return ( new Initial_State() )->render();
	}

	/**
	 * Register REST API
	 */
	public function register_rest_routes() {

		// Get information on most recent 10 backups.
		register_rest_route(
			'jetpack/v4',
			'/backups',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => __CLASS__ . '::get_recent_backups',
				'permission_callback' => __CLASS__ . '::backups_permissions_callback',
			)
		);

		// Get site backup/scan/anti-spam capabilities.
		register_rest_route(
			'jetpack/v4',
			'/backup-capabilities',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => __CLASS__ . '::get_backup_capabilities',
				'permission_callback' => __CLASS__ . '::backups_permissions_callback',
			)
		);

		// Get information on site products.
		// Backup plugin version of /site/purchases from JP plugin.
		// Revert once this route and MyPlan component are extracted to a common package.
		register_rest_route(
			'jetpack/v4',
			'/site/current-purchases',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => __CLASS__ . '::get_site_current_purchases',
				'permission_callback' => __CLASS__ . '::backups_permissions_callback',
			)
		);

		// Get currently promoted product from the product's endpoint.
			register_rest_route(
				'jetpack/v4',
				'/backup-promoted-product-info',
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::get_backup_promoted_product_info',
					'permission_callback' => __CLASS__ . '::backups_permissions_callback',
				)
			);
	}
	/**
	 * The backup calls should only occur from a signed in admin user
	 *
	 * @access public
	 * @static
	 *
	 * @return true|WP_Error
	 */
	public static function backups_permissions_callback() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get information about recent backups
	 *
	 * @access public
	 * @static
	 *
	 * @return array An array of recent backups
	 */
	public static function get_recent_backups() {
		$blog_id = \Jetpack_Options::get_option( 'id' );

		$response = Automattic\Jetpack\Connection\Client::wpcom_json_api_request_as_blog(
			'/sites/' . $blog_id . '/rewind/backups',
			'v2',
			array(),
			null,
			'wpcom'
		);

		if ( 200 !== $response['response']['code'] ) {
			return null;
		}

		return rest_ensure_response(
			json_decode( $response['body'], true )
		);
	}

	/**
	 * Get an array of backup/scan/anti-spam site capabilities
	 *
	 * @access public
	 * @static
	 *
	 * @return array An array of capabilities
	 */
	public static function get_backup_capabilities() {
		$blog_id = \Jetpack_Options::get_option( 'id' );

		$response = Automattic\Jetpack\Connection\Client::wpcom_json_api_request_as_user(
			'/sites/' . $blog_id . '/rewind/capabilities',
			'v2',
			array(),
			null,
			'wpcom'
		);

		if ( is_wp_error( $response ) ) {
			return null;
		}

		if ( 200 !== $response['response']['code'] ) {
			return null;
		}

		return rest_ensure_response(
			json_decode( $response['body'], true )
		);
	}

	/**
	 * Gets information about the currently promoted backup product.
	 *
	 * @return string|WP_Error A JSON object of the current backup product being promoted if the request was successful, or a WP_Error otherwise.
	 */
	public static function get_backup_promoted_product_info() {
		$request_url   = 'https://public-api.wordpress.com/rest/v1.1/products?locale=' . get_user_locale() . '&type=jetpack';
		$wpcom_request = wp_remote_get( esc_url_raw( $request_url ) );
		$response_code = wp_remote_retrieve_response_code( $wpcom_request );
		if ( 200 === $response_code ) {
			$products = json_decode( wp_remote_retrieve_body( $wpcom_request ) );
			return $products->{JETPACK_BACKUP_PROMOTED_PRODUCT};
		} else {
			// Something went wrong so we'll just return the response without caching.
			return new WP_Error(
				'failed_to_fetch_data',
				esc_html__( 'Unable to fetch the requested data.', 'jetpack-backup' ),
				array(
					'status'  => $response_code,
					'request' => $wpcom_request,
				)
			);
		}
	}

	/**
	 * Redirects to plugin page when the plugin is activated
	 *
	 * @access public
	 * @static
	 *
	 * @param string $plugin Path to the plugin file relative to the plugins directory.
	 */
	public static function plugin_activation( $plugin ) {
		if ( JETPACK_BACKUP_PLUGIN_ROOT_FILE_RELATIVE_PATH === $plugin ) {
			wp_safe_redirect( esc_url( admin_url( 'admin.php?page=jetpack-backup' ) ) );
			exit;
		}
	}

	/**
	 * Removes plugin from the connection manager
	 * If it's the last plugin using the connection, the site will be disconnected.
	 *
	 * @access public
	 * @static
	 */
	public static function plugin_deactivation() {
		$manager = new Connection_Manager( 'jetpack-backup' );
		$manager->disconnect_site_wpcom();
		$manager->delete_all_connection_tokens();
	}

	/**
	 * Returns the result of `/sites/%d/purchases` endpoint call.
	 *
	 * @return array of site purchases.
	 */
	public static function get_site_current_purchases() {

		$request  = sprintf( '/sites/%d/purchases', \Jetpack_Options::get_option( 'id' ) );
		$response = Automattic\Jetpack\Connection\Client::wpcom_json_api_request_as_blog( $request, '1.1' );

		// Bail if there was an error or malformed response.
		if ( is_wp_error( $response ) || ! is_array( $response ) || ! isset( $response['body'] ) ) {
			return self::get_failed_fetch_error();
		}

		if ( 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return self::get_failed_fetch_error();
		}

		// Decode the results.
		$results = json_decode( $response['body'], true );

		// Bail if there were no results or purchase details returned.
		if ( ! is_array( $results ) ) {
			return self::get_failed_fetch_error();
		}

		return rest_ensure_response(
			array(
				'code'    => 'success',
				'message' => esc_html__( 'Site purchases correctly received.', 'jetpack-backup' ),
				'data'    => wp_remote_retrieve_body( $response ),
			)
		);
	}
}
