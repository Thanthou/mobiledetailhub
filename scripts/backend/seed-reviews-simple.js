const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Sample review data - just the 4 fields you need
const sampleReviews = [
    // Affiliate reviews
    {
        name: "Sarah Johnson",
        stars: 5,
        title: "Amazing paint correction work!",
        content: "Jess and his team did an incredible job on my 2019 BMW. The paint correction was flawless and the ceramic coating looks amazing. Very professional and showed up exactly on time. Highly recommend!",
        type: "affiliate",
        businessSlug: "jps"
    },
    {
        name: "Mike Chen", 
        stars: 5,
        title: "Best detailing service in town",
        content: "I've used several detailing services before, but JP's Mobile Detailing is by far the best. They're thorough, professional, and the results speak for themselves. My car looks brand new!",
        type: "affiliate",
        businessSlug: "jps"
    },
    {
        name: "Emily Rodriguez",
        stars: 4,
        title: "Great service, minor scheduling issue", 
        content: "The work was excellent and my car looks fantastic. Had a small issue with scheduling - they were running about 30 minutes late, but they called ahead to let me know. Overall very satisfied.",
        type: "affiliate",
        businessSlug: "jps"
    },
    {
        name: "Captain Tom Wilson",
        stars: 5,
        title: "Outstanding ceramic coating work!",
        content: "Mike and his team did an incredible job on my Tesla. The ceramic coating application was flawless and the protection is amazing. Water just beads off! Very professional and explained everything clearly.",
        type: "affiliate", 
        businessSlug: "premium-auto-spa"
    },
    {
        name: "Lisa Anderson",
        stars: 4,
        title: "Professional and reliable",
        content: "Great service for my luxury sedan. They were very professional and completed the work on time. The car looks great and the price was fair. Would recommend to other car owners.",
        type: "affiliate",
        businessSlug: "premium-auto-spa"
    },
    {
        name: "Robert & Mary Thompson",
        stars: 5,
        title: "Perfect mobile detailing service",
        content: "Sarah and her team know mobile detailing! They understood all the unique challenges of mobile service and did an amazing job. The interior looks brand new and the exterior is spotless. Very impressed!",
        type: "affiliate",
        businessSlug: "elite-mobile-detail"
    },
    {
        name: "David Kim",
        stars: 4,
        title: "Great work on our luxury SUV",
        content: "Very thorough cleaning of our Range Rover. They were careful with all the delicate surfaces and did a great job. Only minor issue was they were a bit behind schedule, but the quality made up for it.",
        type: "affiliate",
        businessSlug: "elite-mobile-detail"
    },
    {
        name: "Jennifer Martinez",
        stars: 5,
        title: "Incredible quick service results",
        content: "David and his team provided amazing quick clean service. My car has never looked this good and the turnaround time was incredible. Water just beads off! The team was very professional and explained everything clearly.",
        type: "affiliate",
        businessSlug: "quick-clean-mobile"
    },
    
    // MDH site reviews
    {
        name: "Alex Thompson",
        stars: 5,
        title: "Easy to find great detailing services",
        content: "This platform made it so easy to find and book a detailing service in my area. The booking process was smooth and I could see all the available services and prices upfront. Great experience!",
        type: "mdh"
    },
    {
        name: "Mr. Thompson",
        stars: 5,
        title: "Loved the variety of services available",
        content: "This platform made it so easy to find and book a detailing service in my area. The booking process was smooth and I could see all the available services and prices upfront. Great experience!",
        type: "mdh"
    },
    {
        name: "Rachel Green",
        stars: 4,
        title: "Good platform, could use more features",
        content: "Overall a great platform for finding detailing services. The interface is clean and easy to use. Would love to see more filtering options and maybe a chat feature with the service providers.",
        type: "mdh"
    },
    {
        name: "Mark Davis",
        stars: 5,
        title: "Excellent customer service",
        content: "Had a small issue with my booking and the customer service team resolved it quickly and professionally. The platform itself is great and I've used it multiple times now. Highly recommend!",
        type: "mdh"
    },
    {
        name: "Jennifer Smith",
        stars: 5,
        title: "Fantastic platform for mobile detailing",
        content: "I've used this platform multiple times now and it never disappoints. The booking process is smooth, the service providers are professional, and the results are always excellent. Highly recommend to anyone looking for quality mobile detailing services!",
        type: "mdh"
    }
];

// Function to get affiliate_id from business_slug
async function getAffiliateId(businessSlug) {
    const query = 'SELECT id FROM tenants.business WHERE slug = $1';
    const result = await pool.query(query, [businessSlug]);
    return result.rows[0]?.id || null;
}

// Function to generate a simple email from name
function generateEmail(name) {
    const cleanName = name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '.');
    return `${cleanName}@email.com`;
}

// Function to generate avatar URL (using Unsplash for demo)
function generateAvatarUrl(name) {
    const seed = name.split(' ').join('').toLowerCase();
    return `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&seed=${seed}`;
}

// Function to determine service category based on content
function getServiceCategory(content) {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('ceramic') || lowerContent.includes('coating')) {return 'ceramic';}
    if (lowerContent.includes('paint correction') || lowerContent.includes('paint')) {return 'paint_correction';}
    if (lowerContent.includes('boat') || lowerContent.includes('marine')) {return 'boat';}
    if (lowerContent.includes('rv') || lowerContent.includes('recreational')) {return 'rv';}
    if (lowerContent.includes('ppf') || lowerContent.includes('film')) {return 'ppf';}
    return 'auto'; // default
}

// Function to generate service date (random date within last 6 months)
function generateServiceDate() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
    const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
}

// Function to determine if review should be featured (5 stars and good content)
function shouldBeFeatured(stars, content) {
    return stars === 5 && content.length > 100;
}

// Main seeding function
async function seedReviews() {
    try {
        console.log('🌱 Starting simple review seeding...');
        
        // Clear existing reviews
        console.log('🗑️  Clearing existing reviews...');
        await pool.query('DELETE FROM reputation.reviews');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const review of sampleReviews) {
            try {
                let affiliateId = null;
                
                // Get affiliate_id if this is an affiliate review
                if (review.type === 'affiliate') {
                    affiliateId = await getAffiliateId(review.businessSlug);
                    if (!affiliateId) {
                        console.log(`❌ Business slug '${review.businessSlug}' not found, skipping review`);
                        errorCount++;
                        continue;
                    }
                }
                
                // Generate automatic fields
                const email = generateEmail(review.name);
                const avatarUrl = generateAvatarUrl(review.name);
                const serviceCategory = review.type === 'affiliate' ? getServiceCategory(review.content) : null;
                const serviceDate = review.type === 'affiliate' ? generateServiceDate() : null;
                const isFeatured = shouldBeFeatured(review.stars, review.content);
                const publishedAt = new Date().toISOString();
                
                // Insert review
                const insertQuery = `
                    INSERT INTO reputation.reviews (
                        review_type,
                        affiliate_id,
                        business_slug,
                        rating,
                        title,
                        content,
                        reviewer_name,
                        reviewer_email,
                        reviewer_avatar_url,
                        review_source,
                        status,
                        is_verified,
                        service_category,
                        service_date,
                        is_featured,
                        published_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                `;
                
                const values = [
                    review.type,
                    affiliateId,
                    review.businessSlug,
                    review.stars,
                    review.title,
                    review.content,
                    review.name,
                    email,
                    avatarUrl,
                    'website',
                    'approved',
                    true,
                    serviceCategory,
                    serviceDate,
                    isFeatured,
                    publishedAt
                ];
                
                await pool.query(insertQuery, values);
                console.log(`✅ Added ${review.type} review: "${review.title}" by ${review.name}`);
                successCount++;
                
            } catch (error) {
                console.log(`❌ Error adding review "${review.title}": ${error.message}`);
                errorCount++;
            }
        }
        
        console.log(`\n🎉 Seeding complete!`);
        console.log(`✅ Successfully added: ${successCount} reviews`);
        console.log(`❌ Errors: ${errorCount} reviews`);
        
        // Show summary
        const totalQuery = 'SELECT COUNT(*) as total, review_type, COUNT(*) FILTER (WHERE is_featured = true) as featured FROM reputation.reviews GROUP BY review_type';
        const summary = await pool.query(totalQuery);
        
        console.log('\n📊 Review Summary:');
        summary.rows.forEach(row => {
            console.log(`  ${row.review_type}: ${row.total} total (${row.featured} featured)`);
        });
        
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the seeding
if (require.main === module) {
    seedReviews();
}

module.exports = { seedReviews };
