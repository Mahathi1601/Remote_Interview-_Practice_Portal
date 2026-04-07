const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');
const PracticeQuestion = require('../models/PracticeQuestion');

// @route   POST /api/interview/start
// @desc    Start a new interview session
router.post('/start', protect, async (req, res) => {
    try {
        const { type, difficulty } = req.body;
        
        const session = await InterviewSession.create({
            user: req.user.id,
            type,
            difficulty,
            status: 'in-progress'
        });

        // Get random questions for this interview type
        const questions = await PracticeQuestion.aggregate([
            { $match: { type, difficulty, isActive: true } },
            { $sample: { size: 5 } }
        ]);

        res.status(201).json({
            success: true,
            data: {
                sessionId: session._id,
                questions: questions.map(q => ({
                    id: q._id,
                    question: q.question,
                    tips: q.tips
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/interview/:sessionId/answer
// @desc    Submit answer for a question
router.post('/:sessionId/answer', protect, async (req, res) => {
    try {
        const { questionIndex, answer, timeSpent } = req.body;
        
        const session = await InterviewSession.findById(req.params.sessionId);
        
        if (!session || session.user.toString() !== req.user.id) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Simple AI feedback simulation (you can integrate actual AI here)
        const feedback = generateFeedback(answer);
        const score = calculateScore(answer);

        if (!session.questions[questionIndex]) {
            session.questions[questionIndex] = {};
        }
        
        session.questions[questionIndex].userAnswer = answer;
        session.questions[questionIndex].feedback = feedback;
        session.questions[questionIndex].score = score;
        session.questions[questionIndex].timeSpent = timeSpent;
        
        await session.save();

        res.status(200).json({
            success: true,
            data: { feedback, score }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/interview/:sessionId/complete
// @desc    Complete interview session
router.post('/:sessionId/complete', protect, async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.sessionId);
        
        if (!session || session.user.toString() !== req.user.id) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Calculate overall score
        const totalScore = session.questions.reduce((sum, q) => sum + (q.score || 0), 0);
        const overallScore = session.questions.length > 0 ? totalScore / session.questions.length : 0;
        
        session.overallScore = overallScore;
        session.status = 'completed';
        session.completedAt = new Date();
        
        await session.save();

        res.status(200).json({
            success: true,
            data: {
                overallScore,
                questions: session.questions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Helper functions
function generateFeedback(answer) {
    if (!answer || answer.length < 20) {
        return "Your answer is too short. Try to provide more details and examples.";
    }
    
    if (answer.length > 200) {
        return "Great detail! Consider structuring your answer more clearly with specific examples.";
    }
    
    return "Good answer! You've covered the key points. Try to add more specific examples from your experience.";
}

function calculateScore(answer) {
    if (!answer) return 0;
    
    let score = 50; // Base score
    
    // Length-based scoring
    if (answer.length > 200) score += 20;
    else if (answer.length > 100) score += 10;
    
    // Keyword-based scoring (you can customize this)
    const keywords = ['experience', 'project', 'team', 'learned', 'implemented'];
    const keywordCount = keywords.filter(kw => answer.toLowerCase().includes(kw)).length;
    score += keywordCount * 5;
    
    return Math.min(score, 100);
}

// @route   GET /api/interview/history
// @desc    Get user's interview history
router.get('/history', protect, async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ 
            user: req.user.id,
            status: 'completed'
        }).sort('-createdAt').limit(20);
        
        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;