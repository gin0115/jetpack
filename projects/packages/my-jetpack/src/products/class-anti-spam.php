<?php
/**
 * Anti_Spam product
 *
 * @package my-jetpack
 */

namespace Automattic\Jetpack\My_Jetpack\Products;

use Automattic\Jetpack\My_Jetpack\Product;

/**
 * Class responsible for handling the Anti_Spam product
 */
class Anti_Spam extends Product {

	/**
	 * The product slug
	 *
	 * @var string
	 */
	public static $slug = 'anti-spam';

	/**
	 * The filename (id) of the plugin associated with this product. If not defined, it will default to the Jetpack plugin
	 *
	 * @var string
	 */
	public static $plugin_filename = 'akismet/akismet.php';

	/**
	 * The slug of the plugin associated with this product. If not defined, it will default to the Jetpack plugin
	 *
	 * @var string
	 */
	public static $plugin_slug = 'akismet';

	/**
	 * Whether this product requires a user connection
	 *
	 * @var string
	 */
	public static $requires_user_connection = false;

	/**
	 * Get the internationalized product name
	 *
	 * @return string
	 */
	public static function get_name() {
		return __( 'Anti-Spam', 'jetpack-my-jetpack' );
	}

	/**
	 * Get the internationalized product title
	 *
	 * @return string
	 */
	public static function get_title() {
		return __( 'Jetpack Anti-Spam', 'jetpack-my-jetpack' );
	}

	/**
	 * Get the internationalized product description
	 *
	 * @return string
	 */
	public static function get_description() {
		return __( 'Stop comment and form spam', 'jetpack-my-jetpack' );
	}

	/**
	 * Get the internationalized product long description
	 *
	 * @return string
	 */
	public static function get_long_description() {
		return __( 'Save time and get better responses by automatically blocking spam from your comments and forms.', 'jetpack-my-jetpack' );
	}

	/**
	 * Get the internationalized features list
	 *
	 * @return array Boost features list
	 */
	public static function get_features() {
		return array(
			_x( 'Comment and form spam protection', 'Anti-Spam Product Feature', 'jetpack-my-jetpack' ),
			_x( 'Powered by Akismet', 'Anti-Spam Product Feature', 'jetpack-my-jetpack' ),
			_x( 'Block spam without CAPTCHAs', 'Anti-Spam Product Feature', 'jetpack-my-jetpack' ),
			_x( 'Advanced stats', 'Anti-Spam Product Feature', 'jetpack-my-jetpack' ),
		);
	}

	/**
	 * Get the product princing details
	 *
	 * @return array Pricing details
	 */
	public static function get_pricing_for_ui() {
		return array(
			'available'            => true,
			'currency_code'        => 'EUR',
			'full_price'           => 9.92,
			'promotion_percentage' => 50,
		);
	}

	/**
	 * Return product bundles list
	 * that supports the product.
	 *
	 * @return boolean|array Products bundle list.
	 */
	public static function is_upgradable_by_bundle() {
		return array( 'security' );
	}

	/**
	 * Get the URL where the user manages the product
	 *
	 * @return ?string
	 */
	public static function get_manage_url() {
		return admin_url( 'admin.php?page=akismet-key-config' );
	}
}
