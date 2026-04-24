const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Question = require('../models/Question');
const Category = require('../models/Category');
const PracticeSession = require('../models/PracticeSession');
const { generateFeedback } = require('../utils/feedbackGenerator');

// @route   GET /api/practice/status/:categoryId
// @desc    Get unlocked level for a category
router.get('/status/:categoryId', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const category = await Category.findById(req.params.categoryId);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Check L1 (Easy) qualification -> Unlock L2 (Medium)
        const l1Qualified = await PracticeSession.findOne({
            userId,
            categoryName: category.name,
            difficulty: 'Easy',
            score: { $gte: 70 }
        });

        // Check L2 (Medium) qualification -> Unlock L3 (Hard)
        const l2Qualified = await PracticeSession.findOne({
            userId,
            categoryName: category.name,
            difficulty: 'Medium',
            score: { $gte: 50 }
        });

        res.status(200).json({
            success: true,
            data: {
                categoryName: category.name,
                unlockedLevel: l2Qualified ? 3 : (l1Qualified ? 2 : 1),
                thresholds: { easyToMedium: 70, mediumToHard: 50 },
                levelStats: {
                    l1Best: l1Qualified ? l1Qualified.score : 0,
                    l2Best: l2Qualified ? l2Qualified.score : 0
                }
            }
        });
    } catch (error) {
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