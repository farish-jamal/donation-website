// API Configuration
// Change this URL based on your environment
const API_CONFIG = {
    BASE_URL: 'https://donation-website-s9mi.onrender.com',
    ENDPOINTS: {
        GALLERY: '/api/gallery/get-all-gallery-items',
        BLOG: '/api/blog/get-all-blogs',
        EVENT: '/api/event/get-all-events',
        CONTACT: '/api/contact/create-contact',
        DONATION: '/api/donation/create-donation',
        MEMBER: '/api/member/create-member'
    }
};

// Helper function to build full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

