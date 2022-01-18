window.myJetpackInitialState = {
	siteSuffix: 'my-jetpack-mock-site.com',
};

export const siteWithSecurityPlanResponseBody = {
	ID: 12345678,
	name: 'My awesome Jetpack mock site',
	description: 'Just another mocking WordPress site',
	URL: 'https://my-jetpack-mock-site.com',
	options: {
		timezone: '',
		gmt_offset: 0,
		blog_public: 0,
		login_url: 'https://my-jetpack-mock-site.com/wp-login.php',
		admin_url: 'https://my-jetpack-mock-site.com/wp-admin/',
	},
	plan: {
		product_id: 2017,
		product_slug: 'jetpack_security_t1_monthly',
		product_name: 'Jetpack Security (10GB)',
		product_name_short: 'Security (10GB)',
		expired: false,
		billing_period: 'Monthly',
		user_is_owner: true,
		is_free: false,
		license_key: '',
		features: {
			active: [
				'google-analytics',
				'security-settings',
				'advanced-seo',
				'upload-video-files',
				'video-hosting',
				'wordads-jetpack',
				'akismet',
				'send-a-message',
				'whatsapp-button',
				'social-previews',
				'donations',
				'core/audio',
				'republicize',
				'premium-content/container',
				'support',
			],
			available: {
				'security-settings': [
					'jetpack_free',
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'advanced-seo': [
					'jetpack_free',
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'upload-video-files': [
					'jetpack_free',
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				akismet: [
					'jetpack_free',
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'send-a-message': [
					'jetpack_free',
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'whatsapp-button': [
					'jetpack_free',
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'social-previews': [
					'jetpack_free',
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'google-analytics': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'video-hosting': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'wordads-jetpack': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'vaultpress-backups': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				'vaultpress-backup-archive': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				'vaultpress-storage-space': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				'vaultpress-automated-restores': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				'simple-payments': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
				],
				calendly: [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				opentable: [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				donations: [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'core/video': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				'core/cover': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
				],
				'core/audio': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				republicize: [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'premium-content/container': [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				support: [
					'jetpack_premium',
					'jetpack_business',
					'jetpack_personal',
					'jetpack_premium_monthly',
					'jetpack_business_monthly',
					'jetpack_personal_monthly',
					'jetpack_security_daily',
					'jetpack_security_daily_monthly',
					'jetpack_security_realtime',
					'jetpack_security_realtime_monthly',
					'jetpack_complete',
					'jetpack_complete_monthly',
					'jetpack_security_t1_yearly',
					'jetpack_security_t2_yearly',
					'jetpack_security_t2_monthly',
				],
				'premium-themes': [ 'jetpack_business', 'jetpack_business_monthly' ],
				'vaultpress-security-scanning': [ 'jetpack_business', 'jetpack_business_monthly' ],
				polldaddy: [ 'jetpack_business', 'jetpack_business_monthly' ],
			},
		},
	},
};

export const purchasesList = [
	{
		ID: '18325093',
		user_id: '1700117',
		blog_id: '178317936',
		product_id: '2112',
		subscribed_date: '2022-01-12T01:47:18+00:00',
		renew: '1',
		auto_renew: '1',
		renew_date: '',
		active: '1',
		meta: '',
		ownership_id: '31514526',
		most_recent_renew_date: '2022-01-12T01:47:21+00:00',
		subscription_status: 'active',
		product_name: 'Jetpack Backup (10GB)',
		product_slug: 'jetpack_backup_t1_yearly',
		blog_created_date: '2020-06-02T18:40:08+00:00',
		blogname: 'HelloWord',
		domain: 'retrowolf.ngrok.io',
		description: '',
		attached_to_purchase_id: null,
		included_domain: '',
		included_domain_purchase_amount: 0,
		amount: 108,
		currency_code: 'EUR',
		currency_symbol: '€',
		renewal_price_tier_slug: null,
		renewal_price_tier_usage_quantity: null,
		current_price_tier_slug: null,
		current_price_tier_usage_quantity: null,
		expiry_date: '2023-01-12T00:00:00+00:00',
		introductory_offer: {
			end_date: '2023-01-12T00:00:00+00:00',
			is_within_period: true,
			interval_unit: 'year',
			interval_count: 1,
			usage_limit: null,
			cost_per_interval: 54,
			transition_after_renewal_count: 0,
			is_next_renewal_using_offer: false,
			remaining_renewals_using_offer: 0,
			should_prorate_when_offer_ends: false,
			is_next_renewal_prorated: false,
		},
		expiry_message: 'Expires on January 12, 2023',
		expiry_sub_message: null,
		expiry_status: 'manual-renew',
		price_text: '€108',
		bill_period_label: 'per year',
		regular_price_text: '€108',
		is_cancelable: false,
		can_explicit_renew: true,
		can_disable_auto_renew: false,
		can_reenable_auto_renewal: false,
		is_refundable: false,
		refund_period_in_days: 14,
		is_renewable: true,
		is_renewal: false,
		has_private_registration: false,
		refund_amount: 0,
		refund_currency_symbol: '€',
		refund_text: '€0',
		refund_options: null,
		total_refund_amount: 0,
		total_refund_text: '€0',
		check_dns: false,
	},
	{
		ID: '18325111',
		user_id: '1700117',
		blog_id: '178317936',
		product_id: '2017',
		subscribed_date: '2022-01-12T01:52:26+00:00',
		renew: '1',
		auto_renew: '1',
		renew_date: '',
		active: '1',
		meta: '',
		ownership_id: '31514559',
		most_recent_renew_date: '2022-01-12T01:52:27+00:00',
		subscription_status: 'active',
		product_name: 'Jetpack Security (10GB)',
		product_slug: 'jetpack_security_t1_monthly',
		blog_created_date: '2020-06-02T18:40:08+00:00',
		blogname: 'HelloWord',
		domain: 'retrowolf.ngrok.io',
		description: '',
		attached_to_purchase_id: null,
		included_domain: '',
		included_domain_purchase_amount: 0,
		amount: 22,
		currency_code: 'EUR',
		currency_symbol: '€',
		renewal_price_tier_slug: null,
		renewal_price_tier_usage_quantity: null,
		current_price_tier_slug: null,
		current_price_tier_usage_quantity: null,
		expiry_date: '2022-02-12T00:00:00+00:00',
		expiry_message: 'Expires on February 12, 2022',
		expiry_sub_message: null,
		expiry_status: 'manual-renew',
		price_text: '€22',
		bill_period_label: 'per month',
		regular_price_text: '€22',
		is_cancelable: false,
		can_explicit_renew: true,
		can_disable_auto_renew: false,
		can_reenable_auto_renewal: false,
		is_refundable: false,
		refund_period_in_days: 7,
		is_renewable: true,
		is_renewal: false,
		has_private_registration: false,
		refund_amount: 0,
		refund_currency_symbol: '€',
		refund_text: '€0',
		refund_options: null,
		total_refund_amount: 0,
		total_refund_text: '€0',
		check_dns: false,
	},
];
