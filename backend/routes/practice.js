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

        // Define qualification percentages
        const l1QualificationPercent = 75; // 75% of available questions
        const l2QualificationPercent = 50; // 50% of available questions
        const l1RequiredScore = 75; // Average score must be >= 75%
        const l2RequiredScore = 50; // Average score must be >= 50%

        // Get available question counts dynamically from the database
        const totalQuestionsL1 = await Question.countDocuments({ categoryId: category._id, difficulty: 'Easy', isActive: true }) || 10;
        const totalQuestionsL2 = await Question.countDocuments({ categoryId: category._id, difficulty: 'Medium', isActive: true }) || 10;
        const totalQuestionsL3 = await Question.countDocuments({ categoryId: category._id, difficulty: 'Hard', isActive: true }) || 5;

        const getUniqueStats = (sessions, totalQuestions) => {
            const uniqueQuestions = new Map();
            sessions.forEach(s => {
                const qId = s.questionId.toString();
                // Store the highest score for each question
                if (!uniqueQuestions.has(qId) || uniqueQuestions.get(qId) < s.score) {
                    uniqueQuestions.set(qId, s.score);
                }
            });

            const count = Math.min(uniqueQuestions.size, totalQuestions); // Cap at totalQuestions
            const percentage = totalQuestions > 0 ? Math.min(Math.round((count / totalQuestions) * 100), 100) : 0;
            
            let avgScore = 0;
            if (count > 0) {
                const totalScore = Array.from(uniqueQuestions.values()).reduce((sum, score) => sum + score, 0);
                avgScore = Math.round(totalScore / uniqueQuestions.size);
            }
            
            return { count, percentage, avgScore };
        };

        // Get Level 1 (Easy) stats
        const l1Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Easy'
        });
        const l1Stats = getUniqueStats(l1Sessions, totalQuestionsL1);
        const l1Required = Math.max(1, Math.ceil(totalQuestionsL1 * l1QualificationPercent / 100));
        const l1Qualified = l1Stats.count >= l1Required && l1Stats.avgScore >= l1RequiredScore;

        // Get Level 2 (Medium) stats
        const l2Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Medium'
        });
        const l2Stats = getUniqueStats(l2Sessions, totalQuestionsL2);
        const l2Required = Math.max(1, Math.ceil(totalQuestionsL2 * l2QualificationPercent / 100));
        const l2Qualified = l2Stats.count >= l2Required && l2Stats.avgScore >= l2RequiredScore;

        // Get Level 3 (Hard) stats
        const l3Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Hard'
        });
        const l3Stats = getUniqueStats(l3Sessions, totalQuestionsL3);
        const l3Completed = l3Stats.count >= totalQuestionsL3;

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
                    easyToMedium: `${l1Required}/${totalQuestionsL1} questions with avg ${l1RequiredScore}%`, 
                    mediumToHard: `${l2Required}/${totalQuestionsL2} questions with avg ${l2RequiredScore}%`
                },
                levelStats: {
                    l1: { attempted: l1Stats.count, total: totalQuestionsL1, percentage: l1Stats.percentage, avgScore: l1Stats.avgScore, qualified: l1Qualified },
                    l2: { attempted: l2Stats.count, total: totalQuestionsL2, percentage: l2Stats.percentage, avgScore: l2Stats.avgScore, qualified: l2Qualified },
                    l3: { attempted: l3Stats.count, total: totalQuestionsL3, percentage: l3Stats.percentage, avgScore: l3Stats.avgScore, completed: l3Completed }
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

        const getUniqueStats = (sessions) => {
            const uniqueQuestions = new Map();
            sessions.forEach(s => {
                const qId = s.questionId.toString();
                if (!uniqueQuestions.has(qId) || uniqueQuestions.get(qId) < s.score) {
                    uniqueQuestions.set(qId, s.score);
                }
            });
            const count = uniqueQuestions.size;
            let avgScore = 0;
            if (count > 0) {
                const totalScore = Array.from(uniqueQuestions.values()).reduce((sum, score) => sum + score, 0);
                avgScore = Math.round(totalScore / count);
            }
            return { count, avgScore };
        };

        // Progression Check with percentage-based qualification
        if (difficulty === 'Medium') {
            const l1Sessions = await PracticeSession.find({
                userId,
                categoryName: category.name,
                difficulty: 'Easy'
            });
            const l1Stats = getUniqueStats(l1Sessions);
            const totalQuestionsL1 = await Question.countDocuments({ categoryId: category._id, difficulty: 'Easy', isActive: true }) || 10;
            const l1Required = Math.max(1, Math.ceil(totalQuestionsL1 * 0.75)); // 75% of questions
            const l1Qualified = l1Stats.count >= l1Required && l1Stats.avgScore >= 75;
            
            if (!l1Qualified) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Unlock Level 2 by completing ${l1Required}/${totalQuestionsL1} questions with avg score >= 75% in Level 1` 
                });
            }
        }
        
        if (difficulty === 'Hard') {
            const l2Sessions = await PracticeSession.find({
                userId,
                categoryName: category.name,
                difficulty: 'Medium'
            });
            const l2Stats = getUniqueStats(l2Sessions);
            const totalQuestionsL2 = await Question.countDocuments({ categoryId: category._id, difficulty: 'Medium', isActive: true }) || 10;
            const l2Required = Math.max(1, Math.ceil(totalQuestionsL2 * 0.5)); // 50% of questions
            const l2Qualified = l2Stats.count >= l2Required && l2Stats.avgScore >= 50;
            
            if (!l2Qualified) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Unlock Level 3 by completing ${l2Required}/${totalQuestionsL2} questions with avg score >= 50% in Level 2` 
                });
            }
        }
        
        const filter = { isActive: true, difficulty, categoryId };
        const questions = await Question.find(filter).populate('categoryId', 'name');
        
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