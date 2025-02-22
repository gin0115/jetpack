<?php
/**
 * Base product
 *
 * @package my-jetpack
 */

namespace Automattic\Jetpack\My_Jetpack;

use Automattic\Jetpack\Connection\Manager as Connection_Manager;
use Automattic\Jetpack\Plugins_Installer;
use WP_Error;

/**
 * Class responsible for handling the products
 */
abstract class Product {

	/**
	 * The product slug
	 *
	 * @var string
	 */
	public static $slug = null;

	/**
	 * The filename (id) of the plugin associated with this product. Can be a string with a single value or a list of possible values
	 *
	 * @var string|string[]
	 */
	protected static $plugin_filename = null;

	/**
	 * The slug of the plugin associated with this product. If not defined, it will default to the Jetpack plugin
	 *
	 * @var string
	 */
	public static $plugin_slug = null;

	/**
	 * The Jetpack plugin slug
	 *
	 * @var string
	 */
	const JETPACK_PLUGIN_SLUG = 'jetpack';

	/**
	 * The Jetpack plugin filename
	 *
	 * @var string
	 */
	const JETPACK_PLUGIN_FILENAME = array(
		'jetpack/jetpack.php',
		'jetpack-dev/jetpack.php',
	);

	/**
	 * Whether this product requires a user connection
	 *
	 * @var string
	 */
	public static $requires_user_connection = true;

	/**
	 * Get the plugin slug
	 *
	 * @return ?string
	 */
	public static function get_plugin_slug() {
		return static::$plugin_slug;
	}

	/**
	 * Get the plugin filename
	 *
	 * @return ?string
	 */
	public static function get_plugin_filename() {
		return static::$plugin_filename;
	}

	/**
	 * Get the installed plugin filename
	 *
	 * @return ?string
	 */
	public static function get_installed_plugin_filename() {
		$all_plugins = Plugins_Installer::get_plugins();
		$filename    = static::get_plugin_filename();
		if ( ! is_array( $filename ) ) {
			$filename = array( $filename );
		}
		foreach ( $filename as $name ) {
			$installed = array_key_exists( $name, $all_plugins );
			if ( $installed ) {
				return $name;
			}
		}
	}

	/**
	 * Get the Product info for the API
	 *
	 * @throws \Exception If required attribute is not declared in the child class.
	 * @return array
	 */
	public static function get_info() {
		if ( is_null( static::$slug ) ) {
			throw new \Exception( 'Product classes must declare the $slug attribute.' );
		}
		return array(
			'slug'                     => static::$slug,
			'name'                     => static::get_name(),
			'title'                    => static::get_title(),
			'description'              => static::get_description(),
			'long_description'         => static::get_long_description(),
			'features'                 => static::get_features(),
			'status'                   => static::get_status(),
			'pricing_for_ui'           => static::get_pricing_for_ui(),
			'is_bundle'                => static::is_bundle_product(),
			'is_upgradable_by_bundle'  => static::is_upgradable_by_bundle(),
			'supported_products'       => static::get_supported_products(),
			'wpcom_product_slug'       => static::get_wpcom_product_slug(),
			'requires_user_connection' => static::$requires_user_connection,
			'has_required_plan'        => static::has_required_plan(),
			'manage_url'               => static::get_manage_url(),
			'post_activation_url'      => static::get_post_activation_url(),
			'class'                    => get_called_class(),
		);
	}

	/**
	 * Get the internationalized product name
	 *
	 * @return string
	 */
	abstract public static function get_name();

	/**
	 * Get the internationalized product title
	 *
	 * @return string
	 */
	abstract public static function get_title();

	/**
	 * Get the internationalized product description
	 *
	 * @return string
	 */
	abstract public static function get_description();

	/**
	 * Get the internationalized product long description
	 *
	 * @return string
	 */
	abstract public static function get_long_description();

	/**
	 * Get the internationalized features list
	 *
	 * @return array
	 */
	abstract public static function get_features();

	/**
	 * Get the product pricing
	 *
	 * @return array
	 */
	abstract public static function get_pricing_for_ui();

	/**
	 * Get the URL where the user manages the product
	 *
	 * @return ?string
	 */
	abstract public static function get_manage_url();

	/**
	 * Get the URL the user is taken after activating the product
	 *
	 * @return ?string
	 */
	public static function get_post_activation_url() {
		return static::get_manage_url();
	}

	/**
	 * Get the WPCOM product slug used to make the purchase
	 *
	 * @return ?string
	 */
	public static function get_wpcom_product_slug() {
		return null;
	}

	/**
	 * Checks whether the current plan (or purchases) of the site already supports the product
	 *
	 * Returns true if it supports. Return false if a purchase is still required.
	 *
	 * Free products will always return true.
	 *
	 * @return boolean
	 */
	public static function has_required_plan() {
		return true;
	}

	/**
	 * Checks whether product is a bundle.
	 *
	 * @return boolean True if product is a bundle. Otherwise, False.
	 */
	public static function is_bundle_product() {
		return false;
	}

	/**
	 * Check whether the product is upgradable
	 * by a product bundle.
	 *
	 * @return boolean|array Bundles list or False if not upgradable by a bundle.
	 */
	public static function is_upgradable_by_bundle() {
		return false;
	}

	/**
	 * In case it's a bundle product,
	 * return all the products it contains.
	 * Empty array by default.
	 *
	 * @return Array Product slugs
	 */
	public static function get_supported_products() {
		return array();
	}

	/**
	 * Undocumented function
	 *
	 * @return string
	 */
	public static function get_status() {

		if ( ! self::is_plugin_installed() ) {
			$status = 'plugin_absent';
		} elseif ( ! static::has_required_plan() ) {
			$status = 'needs_purchase';
		} elseif ( static::is_active() ) {
			$status = 'active';
			// We only consider missing user connection an error when the Product is active.
			if ( static::$requires_user_connection && ! ( new Connection_Manager() )->has_connected_owner() ) {
				$status = 'error';
			}
		} else {
			$status = 'inactive';
		}
		return $status;
	}

	/**
	 * Checks whether the Product is active
	 *
	 * @return boolean
	 */
	public static function is_active() {
		return static::is_plugin_active();
	}

	/**
	 * Checks whether the plugin is installed
	 *
	 * @return boolean
	 */
	public static function is_plugin_installed() {
		return (bool) static::get_installed_plugin_filename();
	}

	/**
	 * Checks whether the plugin is active
	 *
	 * @return boolean
	 */
	public static function is_plugin_active() {
		return Plugins_Installer::is_plugin_active( static::get_installed_plugin_filename() );
	}

	/**
	 * Checks whether the Jetpack plugin is installed
	 *
	 * @return boolean
	 */
	public static function is_jetpack_plugin_installed() {
		$all_plugins = Plugins_Installer::get_plugins();
		return array_key_exists( self::JETPACK_PLUGIN_FILENAME, $all_plugins );
	}

	/**
	 * Checks whether the Jetpack plugin is active
	 *
	 * @return boolean
	 */
	public static function is_jetpack_plugin_active() {
		foreach ( self::JETPACK_PLUGIN_FILENAME as $jetpack_filename ) {
			$active = Plugins_Installer::is_plugin_active( $jetpack_filename );
			if ( $active ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Activates the product by installing and activating its plugin
	 *
	 * @return boolean|WP_Error
	 */
	public static function activate() {
		if ( static::is_active() ) {
			return true;
		}

		if ( ! static::is_plugin_installed() ) {
			$installed = Plugins_Installer::install_plugin( static::get_plugin_slug() );
			if ( is_wp_error( $installed ) ) {
				return $installed;
			}
		}

		if ( ! current_user_can( 'activate_plugins' ) ) {
			return new WP_Error( 'not_allowed', __( 'You are not allowed to activate plugins on this site.', 'jetpack-my-jetpack' ) );
		}

		$result = activate_plugin( static::get_installed_plugin_filename() );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		return is_null( $result );
	}

	/**
	 * Deactivate the product
	 *
	 * @return boolean
	 */
	public static function deactivate() {
		deactivate_plugins( static::get_installed_plugin_filename() );
		return true;
	}
}
