const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route   GET /api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
