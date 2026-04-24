const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { body, validationResult } = require('express-validator');
const { loginLimiter } = require('../middleware/rateLimit');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', [
    loginLimiter,
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        // Security: Generic message
        const genericMessage = 'Invalid email or password';

        if (!user) {
            return res.status(401).json({
                success: false,
                message: genericMessage
            });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
            return res.status(403).json({
                success: false,
                message: `Account locked due to multiple failed attempts. Try again in ${remainingMinutes} minutes.`
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            // Increment logic attempts
            user.loginAttempts += 1;
            
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins
                user.loginAttempts = 0; // Reset after locking
            }
            
            await user.save();

            return res.status(401).json({
                success: false,
                message: genericMessage
            });
        }

        // Success: Reset attempts
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset code
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        
        // Security: Don't reveal if user exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a reset code has been sent.'
            });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save code to database
        await PasswordReset.findOneAndUpdate(
            { email },
            { 
                code, 
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
            },
            { upsert: true, new: true }
        );

        // Simulate email
        console.log('----------------------------------------');
        console.log(`📧 Verification code for ${email}: ${code}`);
        console.log(`🔑 Use this code to reset password: ${code}`);
        console.log('----------------------------------------');

        res.status(200).json({
            success: true,
            message: 'Reset code sent successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/verify-code
// @desc    Verify reset code
router.post('/verify-code', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
], async (req, res) => {
    const { email, code } = req.body;

    try {
        const resetEntry = await PasswordReset.findOne({ email, code });

        if (!resetEntry || resetEntry.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Code verified successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password
router.post('/reset-password', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const { email, code, password } = req.body;

    try {
        const resetEntry = await PasswordReset.findOne({ email, code });

        if (!resetEntry || resetEntry.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        // Find user and update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.password = password;
        await user.save();

        // Delete reset entry
        await PasswordReset.deleteOne({ _id: resetEntry._id });

        res.status(200).json({
            success: true,
            message: 'Password reset successful. Please login with your new password.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile
        }
    });
};

module.exports = router;