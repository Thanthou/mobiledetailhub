/**
 * Validation Schemas
 * Predefined validation schemas for different API endpoints
 */

const { validators } = require('./validators');

/**
 * Auth route validation schemas
 */
const authSchemas = {
  register: {
    email: [
      validators.required,
      validators.email,
      validators.length(undefined, 255)
    ],
    password: [
      validators.required,
      validators.length(8, 128)
    ],
    name: [
      validators.required,
      validators.alphabetic,
      validators.length(2, 100)
    ],
    phone: [
      validators.phone,
      validators.length(10, 15)
    ]
  },
  
  login: {
    email: [
      validators.required,
      validators.email
    ],
    password: [
      validators.required
    ]
  }
};

/**
 * Affiliate route validation schemas
 */
const affiliateSchemas = {
  apply: {
    legal_name: [
      validators.required,
      validators.alphanumeric,
      validators.length(2, 200)
    ],
    primary_contact: [
      validators.required,
      validators.alphabetic,
      validators.length(2, 100)
    ],
    phone: [
      validators.required,
      validators.phone
    ],
    email: [
      validators.required,
      validators.email,
      validators.length(undefined, 255)
    ],
    'base_location.city': [
      validators.required,
      validators.alphabetic,
      validators.length(2, 100)
    ],
    'base_location.state': [
      validators.required,
      validators.stateCode
    ],
    'base_location.zip': [
      validators.zipCode
    ],
    categories: [
      validators.array
    ],
    gbp_url: [
      validators.url
    ],
    instagram_url: [
      validators.url
    ],
    tiktok_url: [
      validators.url
    ],
    facebook_url: [
      validators.url
    ],
    youtube_url: [
      validators.url
    ],
    website_url: [
      validators.url
    ],
    has_insurance: [
      validators.boolean
    ],
    accept_terms: [
      validators.required,
      validators.boolean
    ],
    consent_notifications: [
      validators.required,
      validators.boolean
    ],
    source: [
      validators.alphanumeric,
      validators.length(undefined, 100)
    ],
    notes: [
      validators.alphanumeric,
      validators.length(undefined, 1000)
    ]
  },
  
  update: {
    business_name: [
      validators.alphanumeric,
      validators.length(2, 200)
    ],
    slug: [
      validators.slug,
      validators.length(3, 100)
    ],
    description: [
      validators.alphanumeric,
      validators.length(undefined, 2000)
    ],
    phone: [
      validators.phone
    ],
    email: [
      validators.email,
      validators.length(undefined, 255)
    ],
    gbp_url: [
      validators.url
    ],
    instagram_url: [
      validators.url
    ],
    tiktok_url: [
      validators.url
    ],
    facebook_url: [
      validators.url
    ],
    youtube_url: [
      validators.url
    ],
    website_url: [
      validators.url
    ],
    has_insurance: [
      validators.boolean
    ]
  },
  
  approve: {
    admin_notes: [
      validators.alphanumeric,
      validators.length(undefined, 1000)
    ]
  },
  
  reject: {
    rejection_reason: [
      validators.required,
      validators.alphanumeric,
      validators.length(10, 1000)
    ]
  }
};

/**
 * Admin route validation schemas
 */
const adminSchemas = {
  updateAffiliate: {
    business_name: [
      validators.alphanumeric,
      validators.length(2, 200)
    ],
    slug: [
      validators.slug,
      validators.length(3, 100)
    ],
    description: [
      validators.alphanumeric,
      validators.length(undefined, 2000)
    ],
    phone: [
      validators.phone
    ],
    email: [
      validators.email,
      validators.length(undefined, 255)
    ],
    gbp_url: [
      validators.url
    ],
    instagram_url: [
      validators.url
    ],
    tiktok_url: [
      validators.url
    ],
    facebook_url: [
      validators.url
    ],
    youtube_url: [
      validators.url
    ],
    website_url: [
      validators.url
    ],
    has_insurance: [
      validators.boolean
    ],
    admin_notes: [
      validators.alphanumeric,
      validators.length(undefined, 1000)
    ]
  },
  
  updateUser: {
    name: [
      validators.alphabetic,
      validators.length(2, 100)
    ],
    email: [
      validators.email,
      validators.length(undefined, 255)
    ],
    phone: [
      validators.phone
    ],
    role: [
      validators.enum(['user', 'admin', 'affiliate'])
    ],
    is_admin: [
      validators.boolean
    ]
  },
  
  createUser: {
    name: [
      validators.required,
      validators.alphabetic,
      validators.length(2, 100)
    ],
    email: [
      validators.required,
      validators.email,
      validators.length(undefined, 255)
    ],
    phone: [
      validators.phone
    ],
    role: [
      validators.required,
      validators.enum(['user', 'admin', 'affiliate'])
    ],
    password: [
      validators.required,
      validators.length(8, 128)
    ]
  }
};

/**
 * Customer route validation schemas
 */
const customerSchemas = {
  getField: {
    field: [
      validators.required,
      validators.enum([
        'id', 'user_id', 'default_address_id', 'preferences', 'created_at', 'updated_at'
      ])
    ]
  }
};

/**
 * Service area route validation schemas
 */
const serviceAreaSchemas = {
  getCities: {
    state_code: [
      validators.required,
      validators.stateCode
    ]
  }
};

/**
 * Location validation schemas
 */
const locationSchemas = {
  address: {
    line1: [
      validators.alphanumeric,
      validators.length(5, 200)
    ],
    city: [
      validators.required,
      validators.alphabetic,
      validators.length(2, 100)
    ],
    state_code: [
      validators.required,
      validators.stateCode
    ],
    postal_code: [
      validators.zipCode
    ]
  }
};

/**
 * Review validation schemas
 */
const reviewSchemas = {
  submission: {
    review_type: [
      validators.required,
      validators.enum(['affiliate', 'mdh'])
    ],
    affiliate_id: [
      validators.numeric,
      validators.range(1)
    ],
    business_slug: [
      validators.slug,
      validators.length(3, 100)
    ],
    rating: [
      validators.required,
      validators.numeric,
      validators.range(1, 5)
    ],
    title: [
      validators.alphanumeric,
      validators.length(undefined, 255)
    ],
    content: [
      validators.required,
      validators.alphanumeric,
      validators.length(10, 2000)
    ],
    reviewer_name: [
      validators.required,
      validators.alphabetic,
      validators.length(2, 255)
    ],
    reviewer_email: [
      validators.email,
      validators.length(undefined, 255)
    ],
    reviewer_phone: [
      validators.phone,
      validators.length(10, 20)
    ],
    reviewer_avatar_url: [
      validators.url,
      validators.length(undefined, 500)
    ],
    review_source: [
      validators.enum(['website', 'google', 'yelp', 'facebook', 'imported'])
    ],
    service_category: [
      validators.alphanumeric,
      validators.length(undefined, 100)
    ],
    service_date: [
      validators.date
    ],
    booking_id: [
      validators.numeric,
      validators.range(1)
    ]
  },
  
  update: {
    rating: [
      validators.numeric,
      validators.range(1, 5)
    ],
    title: [
      validators.alphanumeric,
      validators.length(undefined, 255)
    ],
    content: [
      validators.alphanumeric,
      validators.length(10, 2000)
    ],
    reviewer_name: [
      validators.alphabetic,
      validators.length(2, 255)
    ],
    reviewer_email: [
      validators.email,
      validators.length(undefined, 255)
    ],
    reviewer_phone: [
      validators.phone,
      validators.length(10, 20)
    ],
    reviewer_avatar_url: [
      validators.url,
      validators.length(undefined, 500)
    ],
    status: [
      validators.enum(['pending', 'approved', 'rejected', 'hidden'])
    ],
    moderation_notes: [
      validators.alphanumeric,
      validators.length(undefined, 1000)
    ],
    is_verified: [
      validators.boolean
    ],
    verification_method: [
      validators.enum(['email', 'phone', 'booking', 'external'])
    ],
    service_category: [
      validators.alphanumeric,
      validators.length(undefined, 100)
    ],
    service_date: [
      validators.date
    ],
    is_featured: [
      validators.boolean
    ]
  },
  
  vote: {
    vote_type: [
      validators.required,
      validators.enum(['helpful', 'not_helpful'])
    ],
    user_ip: [
      validators.required,
      validators.ip
    ]
  }
};

/**
 * Common parameter validation schemas
 */
const commonSchemas = {
  id: {
    id: [
      validators.required,
      validators.numeric,
      validators.range(1)
    ]
  },
  
  slug: {
    slug: [
      validators.required,
      validators.slug,
      validators.length(3, 100)
    ]
  },
  
  email: {
    email: [
      validators.required,
      validators.email
    ]
  },
  
  pagination: {
    page: [
      validators.numeric,
      validators.range(1)
    ],
    limit: [
      validators.numeric,
      validators.range(1, 100)
    ]
  }
};

/**
 * Sanitization schemas
 */
const sanitizationSchemas = {
  affiliate: {
    body: {
      legal_name: 'trim',
      primary_contact: 'trim',
      phone: 'cleanPhone',
      email: 'toLowerCase',
      business_name: 'trim',
      description: 'trim',
      slug: 'toLowerCase',
      notes: 'trim',
      admin_notes: 'trim',
      rejection_reason: 'trim'
    }
  },
  
  auth: {
    body: {
      email: 'toLowerCase',
      name: 'trim',
      phone: 'cleanPhone'
    }
  },
  
  admin: {
    body: {
      business_name: 'trim',
      description: 'trim',
      slug: 'toLowerCase',
      notes: 'trim',
      admin_notes: 'trim',
      rejection_reason: 'trim'
    }
  }
};

module.exports = {
  authSchemas,
  affiliateSchemas,
  adminSchemas,
  customerSchemas,
  serviceAreaSchemas,
  locationSchemas,
  reviewSchemas,
  commonSchemas,
  sanitizationSchemas
};
