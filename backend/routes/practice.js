const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const PracticeQuestion = require('../models/PracticeQuestion');
const User = require('../models/User');

// @route   GET /api/practice/questions
// @desc    Get practice questions with filters
router.get('/questions', protect, async (req, res) => {
    try {
        const { type, difficulty, limit = 10 } = req.query;
        
        const filter = { isActive: true };
        if (type) filter.type = type;
        if (difficulty) filter.difficulty = difficulty;
        
        const questions = await PracticeQuestion.find(filter)
            .limit(parseInt(limit))
            .select('question type difficulty tags');
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/practice/questions/:id
// @desc    Get single practice question with answer
router.get('/questions/:id', protect, async (req, res) => {
    try {
        const question = await PracticeQuestion.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/practice/questions (Admin only)
// @desc    Add new practice question
router.post('/questions', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        // Auto-map alternative field names
        const questionData = { ...req.body };
        if (!questionData.question && questionData.questionText) questionData.question = questionData.questionText;
        if (!questionData.type && questionData.categoryId) questionData.type = questionData.categoryId;
        if (!questionData.sampleAnswer && questionData.idealAnswer) questionData.sampleAnswer = questionData.idealAnswer;
        
        // Normalize difficulty
        if (questionData.difficulty === 'Easy') questionData.difficulty = 'beginner';
        if (questionData.difficulty === 'Medium') questionData.difficulty = 'intermediate';
        if (questionData.difficulty === 'Hard') questionData.difficulty = 'advanced';

        const question = await PracticeQuestion.create({
            ...questionData,
            createdBy: req.user.id
        });
        
        res.status(201).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Seed initial questions
router.post('/seed', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        const initialQuestions = [
            {
                question: "Explain the difference between let, const, and var in JavaScript.",
                type: "technical",
                difficulty: "beginner",
                sampleAnswer: "var is function-scoped, while let and const are block-scoped. var can be redeclared and updated, let can be updated but not redeclared, and const cannot be updated or redeclared.",
                tips: ["Mention hoisting", "Discuss temporal dead zone", "Give practical examples"],
                tags: ["JavaScript", "ES6"]
            },
            {
                question: "Tell me about a time you faced a conflict in your team and how you resolved it.",
                type: "behavioral",
                difficulty: "intermediate",
                sampleAnswer: "In my previous role, two team members disagreed on the technical approach...",
                tips: ["Use STAR method", "Focus on positive outcome", "Show leadership skills"],
                tags: ["Teamwork", "Conflict Resolution"]
            },
            {
                question: "How do you stay updated with the latest technologies?",
                type: "hr",
                difficulty: "beginner",
                sampleAnswer: "I follow tech blogs, participate in online courses, attend meetups...",
                tips: ["Show initiative", "Mention specific resources", "Demonstrate continuous learning"],
                tags: ["Learning", "Professional Development"]
            }
        ];
        
        await PracticeQuestion.insertMany(initialQuestions);
        
        res.status(200).json({
            success: true,
            message: 'Questions seeded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;