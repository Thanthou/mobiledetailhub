# Database Overview (Auto-Generated)

Generated: 2025-10-18T03:43:18.429Z

```

🔍 Database: ThatSmartSite
============================================================

📁 SCHEMAS:
   • analytics
   • auth
   • booking
   • customers
   • reputation
   • schedule
   • system
   • tenants
   • website

📋 TABLES BY SCHEMA:

   analytics/
      └─ google_analytics_tokens

   auth/
      └─ login_attempts
      └─ password_setup_tokens
      └─ refresh_tokens
      └─ user_sessions
      └─ users

   booking/
      └─ availability
      └─ bookings
      └─ quotes

   customers/
      └─ customer_communications
      └─ customer_vehicles
      └─ customers

   reputation/
      └─ review_replies
      └─ review_votes
      └─ reviews

   schedule/
      └─ appointments
      └─ blocked_days
      └─ schedule_settings
      └─ time_blocks

   system/
      └─ health_monitoring
      └─ schema_migrations
      └─ system_config

   tenants/
      └─ business
      └─ service_tiers
      └─ services
      └─ subscriptions
      └─ tenant_applications
      └─ tenant_images

   website/
      └─ content

🔧 COLUMNS BY TABLE:
============================================================

   analytics.google_analytics_tokens
      • id: integer NOT NULL = nextval('analytics.google_anal
      • tenant_id: integer NOT NULL
      • access_token: text NOT NULL
      • refresh_token: text NULL
      • property_id: character varying(255) NULL
      • expires_at: timestamp with time zone NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   auth.login_attempts
      • id: integer NOT NULL = nextval('auth.login_attempts_i
      • email: character varying(255) NOT NULL
      • ip_address: inet NOT NULL
      • user_agent: text NULL
      • success: boolean NOT NULL
      • failure_reason: character varying(100) NULL
      • attempted_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • location_data: jsonb NULL = '{}'::jsonb
      • user_id: integer NULL

   auth.password_setup_tokens
      • id: integer NOT NULL = nextval('auth.password_setup_t
      • user_id: integer NOT NULL
      • token_hash: character varying(255) NOT NULL
      • expires_at: timestamp with time zone NOT NULL
      • used_at: timestamp with time zone NULL
      • ip_address: inet NULL
      • user_agent: text NULL
      • created_at: timestamp with time zone NULL = now()
      • updated_at: timestamp with time zone NULL = now()

   auth.refresh_tokens
      • id: integer NOT NULL = nextval('auth.refresh_tokens_i
      • user_id: integer NOT NULL
      • token_hash: character varying(255) NOT NULL
      • token_family: character varying(255) NOT NULL
      • token_type: character varying(20) NULL = 'refresh'::character varying
      • user_agent: text NULL
      • ip_address: inet NULL
      • device_id: character varying(255) NULL
      • device_fingerprint: character varying(255) NULL
      • location_data: jsonb NULL = '{}'::jsonb
      • expires_at: timestamp with time zone NOT NULL
      • revoked_at: timestamp with time zone NULL
      • revoked_reason: character varying(100) NULL
      • is_revoked: boolean NULL = false
      • is_rotated: boolean NULL = false
      • parent_token_id: integer NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   auth.user_sessions
      • id: integer NOT NULL = nextval('auth.user_sessions_id
      • user_id: integer NOT NULL
      • session_token: character varying(255) NOT NULL
      • refresh_token_id: integer NULL
      • ip_address: inet NULL
      • user_agent: text NULL
      • device_id: character varying(255) NULL
      • device_fingerprint: character varying(255) NULL
      • location_data: jsonb NULL = '{}'::jsonb
      • is_active: boolean NULL = true
      • last_activity_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • expires_at: timestamp with time zone NOT NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   auth.users
      • id: integer NOT NULL = nextval('auth.users_id_seq'::r
      • email: character varying(255) NOT NULL
      • email_verified: boolean NULL = false
      • email_verification_token: character varying(255) NULL
      • email_verification_expires_at: timestamp with time zone NULL
      • name: character varying(255) NOT NULL
      • phone: character varying(20) NULL
      • phone_verified: boolean NULL = false
      • password_hash: character varying(255) NULL
      • password_reset_token: character varying(255) NULL
      • password_reset_expires_at: timestamp with time zone NULL
      • is_admin: boolean NULL = false
      • account_status: character varying(20) NULL = 'active'::character varying
      • last_login_at: timestamp with time zone NULL
      • last_login_ip: inet NULL
      • failed_login_attempts: integer NULL = 0
      • locked_until: timestamp with time zone NULL
      • two_factor_enabled: boolean NULL = false
      • two_factor_secret: character varying(255) NULL
      • two_factor_backup_codes: jsonb NULL = '[]'::jsonb
      • profile_data: jsonb NULL = '{}'::jsonb
      • preferences: jsonb NULL = '{}'::jsonb
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • stripe_customer_id: character varying(255) NULL

   booking.availability
      • id: integer NOT NULL = nextval('booking.availability_
      • affiliate_id: integer NOT NULL
      • date: date NOT NULL
      • start_time: time without time zone NOT NULL
      • end_time: time without time zone NOT NULL
      • capacity: integer NOT NULL = 1
      • is_blocked: boolean NULL = false
      • block_reason: character varying(255) NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   booking.bookings
      • id: integer NOT NULL = nextval('booking.bookings_id_s
      • affiliate_id: integer NOT NULL
      • customer_id: integer NULL
      • service_id: integer NULL
      • tier_id: integer NULL
      • appointment_start: timestamp with time zone NOT NULL
      • appointment_end: timestamp with time zone NOT NULL
      • address_json: jsonb NOT NULL = '{}'::jsonb
      • status: character varying(20) NOT NULL = 'pending'::character varying
      • total_cents: integer NOT NULL = 0
      • stripe_payment_intent_id: text NULL
      • notes: text NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   booking.quotes
      • id: integer NOT NULL = nextval('booking.quotes_id_seq
      • affiliate_id: integer NOT NULL
      • customer_id: integer NULL
      • address_json: jsonb NOT NULL = '{}'::jsonb
      • requested_start: timestamp with time zone NULL
      • status: character varying(20) NOT NULL = 'new'::character varying
      • details_json: jsonb NOT NULL = '{}'::jsonb
      • estimated_total_cents: integer NULL
      • notes: text NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   customers.customer_communications
      • id: integer NOT NULL = nextval('customers.customer_co
      • customer_id: integer NOT NULL
      • communication_type: character varying(50) NOT NULL
      • direction: character varying(10) NOT NULL
      • subject: character varying(255) NULL
      • content: text NOT NULL
      • status: character varying(20) NULL = 'sent'::character varying
      • priority: character varying(10) NULL = 'normal'::character varying
      • category: character varying(50) NULL
      • related_booking_id: integer NULL
      • related_quote_id: integer NULL
      • related_affiliate_id: integer NULL
      • sent_at: timestamp with time zone NULL
      • delivered_at: timestamp with time zone NULL
      • read_at: timestamp with time zone NULL
      • failed_at: timestamp with time zone NULL
      • failure_reason: text NULL
      • response_required: boolean NULL = false
      • response_received_at: timestamp with time zone NULL
      • response_content: text NULL
      • external_id: character varying(255) NULL
      • external_status: character varying(50) NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   customers.customer_vehicles
      • id: integer NOT NULL = nextval('customers.customer_ve
      • customer_id: integer NOT NULL
      • make: character varying(100) NOT NULL
      • model: character varying(100) NOT NULL
      • year: integer NULL
      • color: character varying(50) NULL
      • license_plate: character varying(20) NULL
      • vin: character varying(17) NULL
      • vehicle_type: character varying(20) NOT NULL
      • size_bucket: character varying(10) NULL
      • mileage: integer NULL
      • service_notes: text NULL
      • preferred_services: ARRAY NULL
      • last_service_date: date NULL
      • next_service_due: date NULL
      • is_primary: boolean NULL = false
      • is_active: boolean NULL = true
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   customers.customers
      • id: integer NOT NULL = nextval('customers.customers_i
      • user_id: integer NULL
      • name: character varying(255) NOT NULL
      • email: character varying(255) NULL
      • phone: character varying(50) NULL
      • address: character varying(500) NULL
      • city: character varying(100) NULL
      • state: character varying(50) NULL
      • zip_code: character varying(20) NULL
      • country: character varying(50) NULL = 'US'::character varying
      • status: character varying(20) NULL = 'anonymous'::character varying
      • registration_source: character varying(50) NULL
      • converted_at: timestamp with time zone NULL
      • contact_preferences: jsonb NULL = '{"sms": true, "email": true, 
      • service_preferences: jsonb NULL = '{"service_notes": "", "prefer
      • notes: text NULL
      • tags: ARRAY NULL
      • lifetime_value_cents: integer NULL = 0
      • total_bookings: integer NULL = 0
      • last_booking_at: timestamp with time zone NULL
      • last_activity_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   reputation.review_replies
      • id: integer NOT NULL = nextval('reputation.review_rep
      • review_id: integer NOT NULL
      • content: text NOT NULL
      • author_id: integer NOT NULL
      • author_name: character varying(255) NOT NULL
      • author_role: character varying(50) NOT NULL = 'business_owner'::character va
      • status: character varying(20) NOT NULL = 'published'::character varying
      • created_at: timestamp with time zone NOT NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NOT NULL = CURRENT_TIMESTAMP
      • published_at: timestamp with time zone NULL

   reputation.review_votes
      • id: integer NOT NULL = nextval('reputation.review_vot
      • review_id: integer NOT NULL
      • voter_ip: inet NULL
      • voter_user_id: integer NULL
      • vote_type: character varying(20) NOT NULL
      • created_at: timestamp with time zone NOT NULL = CURRENT_TIMESTAMP

   reputation.reviews
      • id: integer NOT NULL = nextval('reputation.reviews_id
      • tenant_slug: character varying(255) NOT NULL
      • customer_name: character varying(255) NOT NULL
      • rating: smallint NOT NULL
      • comment: text NOT NULL
      • reviewer_url: character varying(500) NULL
      • vehicle_type: character varying(50) NULL
      • paint_correction: boolean NOT NULL = false
      • ceramic_coating: boolean NOT NULL = false
      • paint_protection_film: boolean NOT NULL = false
      • source: character varying(50) NOT NULL = 'website'::character varying
      • avatar_filename: character varying(255) NULL
      • created_at: timestamp with time zone NOT NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NOT NULL = CURRENT_TIMESTAMP
      • published_at: timestamp with time zone NULL

   schedule.appointments
      • id: integer NOT NULL = nextval('schedule.appointments
      • affiliate_id: integer NOT NULL
      • customer_id: integer NULL
      • title: character varying(255) NOT NULL
      • description: text NULL
      • service_type: character varying(100) NOT NULL
      • service_duration: integer NOT NULL
      • start_time: timestamp with time zone NOT NULL
      • end_time: timestamp with time zone NOT NULL
      • customer_name: character varying(255) NOT NULL
      • customer_phone: character varying(20) NOT NULL
      • customer_email: character varying(255) NULL
      • status: character varying(20) NOT NULL = 'scheduled'::character varying
      • price: numeric NULL
      • deposit: numeric NULL = 0
      • notes: text NULL
      • internal_notes: text NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • created_by: integer NULL
      • updated_by: integer NULL

   schedule.blocked_days
      • id: integer NOT NULL = nextval('schedule.blocked_days
      • affiliate_id: integer NOT NULL
      • blocked_date: date NOT NULL
      • reason: character varying(255) NULL
      • is_recurring: boolean NULL = false
      • recurrence_pattern: character varying(20) NULL
      • recurrence_end_date: date NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • created_by: integer NULL

   schedule.schedule_settings
      • id: integer NOT NULL = nextval('schedule.schedule_set
      • affiliate_id: integer NOT NULL
      • business_hours: jsonb NOT NULL = '{"friday": {"end": "17:00", "
      • default_appointment_duration: integer NULL = 60
      • buffer_time: integer NULL = 15
      • max_appointments_per_day: integer NULL = 20
      • advance_booking_days: integer NULL = 30
      • same_day_booking_allowed: boolean NULL = true
      • time_slot_interval: integer NULL = 15
      • earliest_appointment_time: time without time zone NULL = '08:00:00'::time without time 
      • latest_appointment_time: time without time zone NULL = '18:00:00'::time without time 
      • send_reminders: boolean NULL = true
      • reminder_hours_before: integer NULL = 24
      • send_confirmation_emails: boolean NULL = true
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_by: integer NULL

   schedule.time_blocks
      • id: integer NOT NULL = nextval('schedule.time_blocks_
      • affiliate_id: integer NOT NULL
      • title: character varying(255) NOT NULL
      • description: text NULL
      • block_type: character varying(50) NOT NULL = 'unavailable'::character varyi
      • start_time: timestamp with time zone NOT NULL
      • end_time: timestamp with time zone NOT NULL
      • is_recurring: boolean NULL = false
      • recurrence_pattern: character varying(20) NULL
      • recurrence_end_date: timestamp with time zone NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • created_by: integer NULL

   system.health_monitoring
      • id: integer NOT NULL = nextval('system.health_monitor
      • tenant_slug: character varying(255) NOT NULL
      • check_type: character varying(50) NOT NULL
      • url: character varying(500) NOT NULL
      • overall_score: integer NULL
      • performance_score: integer NULL
      • accessibility_score: integer NULL
      • best_practices_score: integer NULL
      • seo_score: integer NULL
      • strategy: character varying(20) NULL
      • lcp_value: numeric NULL
      • lcp_score: numeric NULL
      • fid_value: numeric NULL
      • fid_score: numeric NULL
      • cls_value: numeric NULL
      • cls_score: numeric NULL
      • fcp_value: numeric NULL
      • fcp_score: numeric NULL
      • ttfb_value: numeric NULL
      • ttfb_score: numeric NULL
      • speed_index_value: numeric NULL
      • speed_index_score: numeric NULL
      • interactive_value: numeric NULL
      • interactive_score: numeric NULL
      • total_blocking_time_value: numeric NULL
      • total_blocking_time_score: numeric NULL
      • raw_data: jsonb NULL
      • opportunities: jsonb NULL
      • diagnostics: jsonb NULL
      • crux_data: jsonb NULL
      • status: character varying(20) NOT NULL = 'healthy'::character varying
      • error_message: text NULL
      • checked_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • business_id: integer NULL

   system.schema_migrations
      • id: integer NOT NULL = nextval('system.schema_migrati
      • filename: text NOT NULL
      • applied_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • checksum: text NULL
      • rollback_sql: text NULL

   system.system_config
      • id: integer NOT NULL = nextval('system.system_config_
      • config_key: character varying(255) NOT NULL
      • config_value: text NULL
      • config_type: character varying(50) NULL = 'string'::character varying
      • description: text NULL
      • is_public: boolean NULL = false
      • is_encrypted: boolean NULL = false
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   tenants.business
      • id: integer NOT NULL = nextval('tenants.business_new_
      • industry: character varying(50) NOT NULL
      • slug: character varying(255) NOT NULL
      • business_name: character varying(255) NOT NULL
      • owner: character varying(255) NULL
      • first_name: character varying(255) NULL
      • last_name: character varying(255) NULL
      • user_id: integer NULL
      • application_status: character varying(50) NULL = 'pending'::character varying
      • business_start_date: date NULL
      • business_phone: character varying(20) NULL
      • personal_phone: character varying(20) NULL
      • business_email: character varying(255) NULL
      • personal_email: character varying(255) NULL
      • twilio_phone: character varying(20) NULL
      • sms_phone: character varying(20) NULL
      • gbp_url: text NULL
      • facebook_url: text NULL
      • instagram_url: text NULL
      • youtube_url: text NULL
      • tiktok_url: text NULL
      • source: character varying(255) NULL
      • notes: text NULL
      • service_areas: jsonb NULL
      • application_date: timestamp with time zone NULL
      • approved_date: timestamp with time zone NULL
      • last_activity: timestamp with time zone NULL
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • website: text NULL
      • example_field: text NULL

   tenants.service_tiers
      • id: integer NOT NULL = nextval('tenants.service_tiers
      • service_id: integer NOT NULL
      • tier_name: character varying(255) NOT NULL
      • price_cents: integer NOT NULL = 0
      • included_services: jsonb NOT NULL = '[]'::jsonb
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • duration_minutes: integer NULL = 60
      • metadata: jsonb NULL = '{}'::jsonb
      • is_active: boolean NULL = true
      • is_featured: boolean NULL = false
      • sort_order: integer NULL = 0

   tenants.services
      • id: integer NOT NULL = nextval('tenants.services_id_s
      • business_id: integer NOT NULL
      • service_name: character varying(255) NOT NULL
      • service_description: text NULL
      • service_category: character varying(100) NULL
      • service_type: character varying(100) NULL
      • vehicle_types: jsonb NULL = '["auto", "boat", "rv", "truck
      • is_active: boolean NULL = true
      • is_featured: boolean NULL = false
      • sort_order: integer NULL = 0
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • metadata: jsonb NULL = '{}'::jsonb

   tenants.subscriptions
      • id: integer NOT NULL = nextval('tenants.subscriptions
      • business_id: integer NOT NULL
      • plan_type: character varying(20) NOT NULL
      • plan_price_cents: integer NOT NULL
      • billing_cycle: character varying(20) NOT NULL = 'monthly'::character varying
      • starts_at: timestamp with time zone NOT NULL
      • ends_at: timestamp with time zone NULL
      • cancelled_at: timestamp with time zone NULL
      • status: character varying(20) NOT NULL = 'active'::character varying
      • stripe_subscription_id: character varying(255) NULL
      • stripe_customer_id: character varying(255) NULL
      • stripe_price_id: character varying(255) NULL
      • is_trial: boolean NULL = false
      • trial_ends_at: timestamp with time zone NULL
      • last_billing_attempt_at: timestamp with time zone NULL
      • last_successful_payment_at: timestamp with time zone NULL
      • failed_payment_attempts: integer NULL = 0
      • next_billing_date: timestamp with time zone NULL
      • cancel_reason: character varying(255) NULL
      • cancel_reason_details: text NULL
      • cancelled_by: character varying(50) NULL
      • previous_plan: character varying(20) NULL
      • plan_change_reason: character varying(255) NULL
      • metadata: jsonb NULL = '{}'::jsonb
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   tenants.tenant_applications
      • id: integer NOT NULL = nextval('tenants.tenant_applic
      • first_name: character varying(100) NOT NULL
      • last_name: character varying(100) NOT NULL
      • personal_phone: character varying(20) NOT NULL
      • personal_email: character varying(255) NOT NULL
      • business_name: character varying(255) NOT NULL
      • business_phone: character varying(20) NULL
      • business_email: character varying(255) NULL
      • industry: character varying(50) NULL
      • business_address: character varying(500) NULL
      • business_city: character varying(100) NULL
      • business_state: character varying(50) NULL
      • business_zip: character varying(20) NULL
      • selected_plan: character varying(20) NULL
      • plan_price_cents: integer NULL
      • billing_address: character varying(500) NULL
      • billing_city: character varying(100) NULL
      • billing_state: character varying(50) NULL
      • billing_zip: character varying(20) NULL
      • use_same_address: boolean NULL = true
      • current_step: integer NULL = 0
      • status: character varying(20) NULL = 'draft'::character varying
      • stripe_customer_id: character varying(255) NULL
      • stripe_payment_intent_id: character varying(255) NULL
      • stripe_subscription_id: character varying(255) NULL
      • draft_data: jsonb NULL
      • source: character varying(100) NULL
      • referrer_url: text NULL
      • utm_source: character varying(100) NULL
      • utm_medium: character varying(100) NULL
      • utm_campaign: character varying(100) NULL
      • user_agent: text NULL
      • ip_address: inet NULL
      • started_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • submitted_at: timestamp with time zone NULL
      • approved_at: timestamp with time zone NULL
      • expires_at: timestamp with time zone NULL = (CURRENT_TIMESTAMP + '30 days'
      • last_saved_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP

   tenants.tenant_images
      • id: integer NOT NULL = nextval('tenants.tenant_images
      • tenant_slug: character varying(255) NOT NULL
      • filename: character varying(255) NOT NULL
      • file_path: character varying(500) NOT NULL
      • file_size: integer NULL
      • mime_type: character varying(100) NULL
      • image_category: character varying(50) NULL = 'gallery'::character varying
      • uploaded_at: timestamp without time zone NULL = now()
      • is_stock: boolean NULL = false
      • is_active: boolean NULL = true

   website.content
      • id: integer NOT NULL = nextval('website.content_id_se
      • business_id: integer NOT NULL
      • header_logo_url: character varying(500) NULL
      • header_icon_url: character varying(500) NULL
      • hero_title: character varying(500) NULL
      • hero_subtitle: text NULL
      • reviews_title: character varying(255) NULL
      • reviews_subtitle: text NULL
      • faq_title: character varying(255) NULL
      • faq_subtitle: text NULL
      • faq_items: jsonb NULL = '[]'::jsonb
      • custom_sections: jsonb NULL = '[]'::jsonb
      • created_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • updated_at: timestamp with time zone NULL = CURRENT_TIMESTAMP
      • reviews_avg_rating: numeric NULL = 0.00
      • reviews_total_count: integer NULL = 0
      • seo_title: character varying(255) NULL
      • seo_description: text NULL
      • seo_keywords: text NULL
      • seo_og_image: character varying(500) NULL
      • seo_twitter_image: character varying(500) NULL
      • seo_canonical_path: character varying(500) NULL
      • seo_robots: character varying(50) NULL = 'index,follow'::character vary

✅ Done!


```
