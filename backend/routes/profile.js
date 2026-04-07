const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get current user profile
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/profile
// @desc    Update user profile
router.put('/', protect, async (req, res) => {
    try {
        const allowedUpdates = ['name', 'profile'];
        const updates = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/profile/skills
// @desc    Add skills to profile
router.post('/skills', protect, async (req, res) => {
    try {
        const { skills } = req.body;
        
        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({
                success: false,
                message: 'Skills must be an array'
            });
        }

        const user = await User.findById(req.user.id);
        user.profile.skills = [...new Set([...user.profile.skills, ...skills])];
        await user.save();

        res.status(200).json({
            success: true,
            data: user.profile.skills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;