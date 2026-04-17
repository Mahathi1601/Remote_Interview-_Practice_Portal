const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.log('Auth failed: No token provided in headers');
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please login again.'
        });
    }

    try {
        console.log('Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified, decoded id:', decoded.id);
        
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            console.log('Auth failed: User not found in database for ID:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'User account no longer exists. Please re-register.'
            });
        }
        
        console.log('Auth success: User found:', req.user.email);
        next();
    } catch (err) {
        console.error('Auth failure - JWT Error:', err.message);
        
        // Distinguish between expired and invalid tokens
        let message = 'Not authorized to access this route';
        if (err.name === 'TokenExpiredError') {
            message = 'Session expired. Please login again.';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Invalid session. Please login again.';
        }

        return res.status(401).json({
            success: false,
            message: message
        });
    }
};

module.exports = { protect };