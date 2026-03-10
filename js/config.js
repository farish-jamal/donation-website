// API Configuration
// Change this URL based on your environment
const API_CONFIG = {
    BASE_URL: 'https://donation-website-s9mi.onrender.com', // For local development
    ENDPOINTS: {
        GALLERY: '/api/gallery/get-all-gallery-items',
        BLOG: '/api/blog/get-all-blogs',
        EVENT: '/api/event/get-all-events',
        CONTACT: '/api/contact/create-contact',
        DONATION: '/api/donation/create-donation',
        MEMBER: '/api/member/create-member',
        CREATE_ORDER: '/api/payment/create-order',
        VERIFY_PAYMENT: '/api/payment/verify'
    },
    // Razorpay Configuration
    RAZORPAY: {
        KEY_ID: 'rzp_live_SPCczklkBhWEY6' // Replace with your actual Razorpay key ID
    }
};

// Helper function to build full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

