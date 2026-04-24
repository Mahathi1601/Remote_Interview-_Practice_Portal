const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MockInterviewSession = require('../models/MockInterviewSession');
const MockQuestion = require('../models/MockQuestion');

// @route   GET /api/mock/questions
// @desc    Get mock interview questions by type from database
router.get('/questions', protect, async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Interview type is required (e.g. ?type=technical)'
            });
        }

        const questions = await MockQuestion.find({
            interviewType: type.toLowerCase(),
            isActive: true
        }).select('questionText difficulty timeLimit tips interviewType');

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        console.error('Error fetching mock questions:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/mock/types
// @desc    Get all distinct interview types available in the DB
router.get('/types', protect, async (req, res) => {
    try {
        const types = await MockQuestion.distinct('interviewType', { isActive: true });
        res.status(200).json({ success: true, data: types });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/mock/submit
// @desc    Record a mock interview session
router.post('/submit', protect, async (req, res) => {
    try {
        const {
            interviewType,
            confidenceScore,
            hasVideo,
            videoUrl,
            videoDuration,
            feedback,
            overallScore,
            communicationScore,
            technicalScore,
            questionsAsked,
            questionsCorrect,
            duration,
            strengths,
            improvementAreas
        } = req.body;

        const session = await MockInterviewSession.create({
            userId: req.user.id,
            interviewType,
            confidenceScore,
            hasVideo: hasVideo || false,
            videoUrl: videoUrl || null,
            videoDuration: videoDuration || 0,
            feedback,
            overallScore: overallScore || 0,
            communicationScore: communicationScore || 0,
            technicalScore: technicalScore || 0,
            questionsAsked: questionsAsked || 0,
            questionsCorrect: questionsCorrect || 0,
            duration: duration || 0,
            strengths: strengths || [],
            improvementAreas: improvementAreas || []
        });

        res.status(201).json({ success: true, data: session });
    } catch (error) {
        console.error('Error saving mock session:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/mock/sessions
// @desc    Get all mock sessions for a user
router.get('/sessions', protect, async (req, res) => {
    try {
        const sessions = await MockInterviewSession.find({ userId: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
