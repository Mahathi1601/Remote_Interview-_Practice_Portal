const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const InterviewPlan = require('../models/InterviewPlan');

// @route   GET /api/interview-plans
// @desc    Get all upcoming interview plans for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const plans = await InterviewPlan.find({ user: req.user.id })
            .sort({ dateTime: 1 }); // Sort chronologically (earliest first)

        res.status(200).json({
            success: true,
            count: plans.length,
            data: plans
        });
    } catch (error) {
        console.error('Error fetching interview plans:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/interview-plans
// @desc    Add a new upcoming interview plan
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { companyName, role, dateTime, interviewLink, mode, notes } = req.body;

        if (!companyName || !role || !dateTime) {
            return res.status(400).json({
                success: false,
                message: 'Please provide company name, role, and date/time'
            });
        }

        const plan = await InterviewPlan.create({
            user: req.user.id,
            companyName,
            role,
            dateTime,
            interviewLink,
            mode,
            notes
        });

        res.status(201).json({
            success: true,
            data: plan
        });
    } catch (error) {
        console.error('Error creating interview plan:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/interview-plans/:id
// @desc    Delete an interview plan
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const plan = await InterviewPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Interview plan not found'
            });
        }

        // Make sure user owns the plan
        if (plan.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this plan'
            });
        }

        await plan.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting interview plan:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
