const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

// @route   GET /api/questions
// @desc    Get all active questions
router.get('/', protect, async (req, res) => {
    try {
        const questions = await Question.find({ isActive: true }).populate('categoryId', 'name');
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
