const session = require('express-session');

// Session configuration
const sessionConfig = {
    // Encryption key for signing the session ID cookie
    secret: process.env.SESSION_SECRET || 'fallback_secret_for_development',
    
    // Prevents unnecessary session store writes
    resave: false,
    
    // Helps comply with privacy laws
    saveUninitialized: false,
    
    // Cookie-specific settings
    cookie: {
        // Secure cookies in production
        secure: process.env.NODE_ENV === 'production',
        
        // Session lifetime (24 hours)
        maxAge: 24 * 60 * 60 * 1000,

        // Mitigate cross-site scripting (XSS) attacks
        httpOnly: true
    }
};

module.exports = sessionConfig;
