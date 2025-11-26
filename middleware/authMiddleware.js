const { requireAuth, getAuth } = require('@clerk/express');

const authenticateUser = (req, res, next) => {
    try {
        console.log('=== Auth Check ===');
        console.log('Headers:', req.headers.authorization);
        
        const auth = getAuth(req);
        console.log('Auth object:', auth);
        
        if (!auth || !auth.userId) {
            console.log('Auth check failed - no userId found');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No valid session found'
            });
        }
        
        console.log('Auth successful for user:', auth.userId);
        req.auth = auth;
        req.userId = auth.userId;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

const getUserId = (req, res, next) => {
    // This is now redundant since authenticateUser handles it
    next();
};

module.exports = { authenticateUser, getUserId };
