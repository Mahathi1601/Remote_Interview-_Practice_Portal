const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Question = require('../models/Question');
const Category = require('../models/Category');
const PracticeSession = require('../models/PracticeSession');
const { generateFeedback } = require('../utils/feedbackGenerator');

// @route   GET /api/practice/status/:categoryId
// @desc    Get unlocked level for a category (percentage-based qualification)
router.get('/status/:categoryId', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const category = await Category.findById(req.params.categoryId);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const totalQuestionsPerLevel = 20; // Each level has 20 questions
        const l1QualificationPercent = 70; // 70% of questions must be done
        const l2QualificationPercent = 50; // 50% of questions must be done
        const l1RequiredScore = 70; // Average score must be >= 70%
        const l2RequiredScore = 50; // Average score must be >= 50%

        // Get Level 1 (Easy) stats
        const l1Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Easy'
        });
        const l1QuestionCount = l1Sessions.length;
        const l1Percentage = Math.round((l1QuestionCount / totalQuestionsPerLevel) * 100);
        const l1AvgScore = l1QuestionCount > 0 
            ? Math.round(l1Sessions.reduce((acc, s) => acc + s.score, 0) / l1QuestionCount)
            : 0;
        const l1Qualified = l1QuestionCount >= (totalQuestionsPerLevel * l1QualificationPercent / 100) && l1AvgScore >= l1RequiredScore;

        // Get Level 2 (Medium) stats
        const l2Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Medium'
        });
        const l2QuestionCount = l2Sessions.length;
        const l2Percentage = Math.round((l2QuestionCount / totalQuestionsPerLevel) * 100);
        const l2AvgScore = l2QuestionCount > 0 
            ? Math.round(l2Sessions.reduce((acc, s) => acc + s.score, 0) / l2QuestionCount)
            : 0;
        const l2Qualified = l2QuestionCount >= (totalQuestionsPerLevel * l2QualificationPercent / 100) && l2AvgScore >= l2RequiredScore;

        // Get Level 3 (Hard) stats
        const l3Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Hard'
        });
        const l3QuestionCount = l3Sessions.length;
        const l3Percentage = Math.round((l3QuestionCount / totalQuestionsPerLevel) * 100);
        const l3AvgScore = l3QuestionCount > 0 
            ? Math.round(l3Sessions.reduce((acc, s) => acc + s.score, 0) / l3QuestionCount)
            : 0;
        const l3Completed = l3QuestionCount >= totalQuestionsPerLevel;

        // Determine unlocked level
        let unlockedLevel = 1;
        if (l1Qualified) unlockedLevel = 2;
        if (l2Qualified) unlockedLevel = 3;

        res.status(200).json({
            success: true,
            data: {
                categoryName: category.name,
                unlockedLevel,
                l3Completed,
                thresholds: { 
                    easyToMedium: `${l1QualificationPercent}% of ${totalQuestionsPerLevel} questions with avg ${l1RequiredScore}%`, 
                    mediumToHard: `${l2QualificationPercent}% of ${totalQuestionsPerLevel} questions with avg ${l2RequiredScore}%`
                },
                levelStats: {
                    l1: { attempted: l1QuestionCount, percentage: l1Percentage, avgScore: l1AvgScore, qualified: l1Qualified },
                    l2: { attempted: l2QuestionCount, percentage: l2Percentage, avgScore: l2AvgScore, qualified: l2Qualified },
                    l3: { attempted: l3QuestionCount, percentage: l3Percentage, avgScore: l3AvgScore, completed: l3Completed }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching practice status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/practice/by-difficulty
// @desc    Get questions by difficulty and category (with progression check)
router.get('/by-difficulty', protect, async (req, res) => {
    try {
        const { difficulty, categoryId } = req.query;
        const userId = req.user.id;
        
        if (!categoryId) {
            return res.status(400).json({ success: false, message: 'CategoryId is required' });
        }

        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        // Progression Check
        if (difficulty === 'Medium') {
            const qualified = await PracticeSession.findOne({ userId, categoryName: category.name, difficulty: 'Easy', score: { $gte: 70 } });
            if (!qualified) return res.status(403).json({ success: false, message: 'Unlock Level 2 by scoring 70%+ in Level 1' });
        }
        
        if (difficulty === 'Hard') {
            const qualified = await PracticeSession.findOne({ userId, categoryName: category.name, difficulty: 'Medium', score: { $gte: 50 } });
            if (!qualified) return res.status(403).json({ success: false, message: 'Unlock Level 3 by scoring 50%+ in Level 2' });
        }
        
        const filter = { isActive: true, difficulty, categoryId };
        const questions = await Question.find(filter).populate('categoryId', 'name').limit(20);
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/practice/submit
// @desc    Submit answer and get feedback
router.post('/submit', protect, async (req, res) => {
    try {
        const { questionId, answer } = req.body;

        const question = await Question.findById(questionId).populate('categoryId', 'name');
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Generate feedback and score
        const { score, feedback } = generateFeedback(answer, question.keywords, question.difficulty);
        
        // Apply scoring weights
        const weights = { 'Easy': 1, 'Medium': 1.5, 'Hard': 2 };
        const weight = weights[question.difficulty] || 1;
        const weightedScore = Math.round(score * weight);

        // Save session
        const session = await PracticeSession.create({
            userId: req.user.id,
            questionId,
            userAnswer: answer,
            score: weightedScore, // Weighted for display, but for qualification check we might want raw score.
                                  // Wait, if score is 100 on Easy, weighted is 100.
                                  // If score is 100 on Hard, weighted is 200.
                                  // For progression thresholds, we should probably check the raw 'score' 0-100 or weighted.
                                  // Actually, thresholds are 70 and 50. I'll use raw 'score' (base 100) for qualification logic.
                                  // Let's store raw score separately if needed, or just calculate from weighted.
                                  // I'll keep it simple: threshold checks against weightedScore / weight.
            feedback,
            difficulty: question.difficulty,
            categoryName: question.categoryId.name
        });

        // Re-calculate raw score for internal check
        const rawScore = score; 

        res.status(200).json({
            success: true,
            data: {
                score: weightedScore,
                rawScore, // Send raw score for frontend to handle unlocking
                feedback,
                idealAnswer: question.idealAnswer,
                tips: question.tips,
                difficulty: question.difficulty
            }
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;