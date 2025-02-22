<?php
/**
 * Fetches and store the list of Jetpack products available in WPCOM
 *
 * @package automattic/my-jetpack
 */

namespace Automattic\Jetpack\My_Jetpack;

use Automattic\Jetpack\Connection\Client as Client;
use Automattic\Jetpack\Status\Visitor;
use WP_Error;
/**
 * Stores the list of products available for purchase in WPCOM
 */
class Wpcom_Products {

	/**
	 * The meta name used to store the cache date
	 *
	 * @var string
	 */
	const CACHE_DATE_META_NAME = 'my-jetpack-cache-date';

	/**
	 * The meta name used to store the cache
	 *
	 * @var string
	 */
	const CACHE_META_NAME = 'my-jetpack-cache';

	/**
	 * Fetches the list of products from WPCOM
	 *
	 * @return Object|WP_Error
	 */
	private static function get_products_from_wpcom() {

		$blog_id  = \Jetpack_Options::get_option( 'id' );
		$endpoint = sprintf( '/sites/%d/products/?_locale=%s&type=jetpack', $blog_id, get_user_locale() );

		$wpcom_request = Client::wpcom_json_api_request_as_blog(
			$endpoint,
			'1.1',
			array(
				'method'  => 'GET',
				'headers' => array(
					'X-Forwarded-For' => ( new Visitor() )->get_ip( true ),
				),
			)
		);

		$response_code = wp_remote_retrieve_response_code( $wpcom_request );

		if ( 200 === $response_code ) {
			return json_decode( wp_remote_retrieve_body( $wpcom_request ) );
		} else {
			return new WP_Error(
				'failed_to_fetch_wpcom_products',
				esc_html__( 'Unable to fetch the products list from WordPress.com', 'jetpack-my-jetpack' ),
				array( 'status' => $response_code )
			);
		}
	}

	/**
	 * Update the cache with new information retrieved from WPCOM
	 *
	 * We store one cache for each user, as the information is internationalized based on user preferences
	 * Also, the currency is based on the user IP address
	 *
	 * @param Object $products_list The products list as received from WPCOM.
	 * @return bool
	 */
	private static function update_cache( $products_list ) {
		update_user_meta( get_current_user_id(), self::CACHE_DATE_META_NAME, time() );
		return update_user_meta( get_current_user_id(), self::CACHE_META_NAME, $products_list );
	}

	/**
	 * Checks if the cache is old, meaning we need to fetch new data from WPCOM
	 */
	private static function is_cache_old() {
		if ( empty( self::get_products_from_cache() ) ) {
			return true;
		}
		$cache_date = get_user_meta( get_current_user_id(), self::CACHE_DATE_META_NAME, true );
		return time() - (int) $cache_date > ( 7 * DAY_IN_SECONDS );
	}

	/**
	 * Gets the product list from the user cache
	 */
	private static function get_products_from_cache() {
		return get_user_meta( get_current_user_id(), self::CACHE_META_NAME, true );
	}

	/**
	 * Gets the product list
	 *
	 * Attempts to retrieve the products list from the user cache if cache is not too old.
	 * If cache is old, it will attempt to fetch information from WPCOM. If it fails, we return what we have in cache, if anything, otherwise we return an error.
	 *
	 * @param bool $skip_cache If true it will ignore the cache and attempt to fetch fresh information from WPCOM.
	 *
	 * @return Object|WP_Error
	 */
	public static function get_products( $skip_cache = false ) {
		// This is only available for logged in users.
		if ( ! get_current_user_id() ) {
			return null;
		}
		if ( ! self::is_cache_old() && ! $skip_cache ) {
			return self::get_products_from_cache();
		}

		$products = self::get_products_from_wpcom();
		if ( is_wp_error( $products ) ) {
			// Let's see if we have it cached.
			$cached = self::get_products_from_cache();
			if ( ! empty( $cached ) ) {
				return $cached;
			} else {
				return $products;
			}
		}

		self::update_cache( $products );
		return $products;

	}

	/**
	 * Get one product
	 *
	 * @param string $product_slug The product slug.
	 *
	 * @return ?Object The product details if found
	 */
	public static function get_product( $product_slug ) {
		$products = self::get_products();
		if ( ! empty( $products->$product_slug ) ) {
			return $products->$product_slug;
		}
	}

	/**
	 * Get only the product currency code and price in an array
	 *
	 * @param string $product_slug The product slug.
	 *
	 * @return array An array with currency_code and full_price. Empty array if product not found.
	 */
	public static function get_product_currency_and_price( $product_slug ) {
		$products = self::get_products();
		if ( ! empty( $products->$product_slug ) ) {
			return array(
				'currency_code' => $products->$product_slug->currency_code,
				'full_price'    => $products->$product_slug->cost,
			);
		}
		return array();
	}

}
