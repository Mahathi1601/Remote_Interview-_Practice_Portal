const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Question = require('../models/Question');
const Category = require('../models/Category');
const PracticeSession = require('../models/PracticeSession');
const { generateFeedback } = require('../utils/feedbackGenerator');
const { generateAIQuestions, evaluateAIResponse } = require('../utils/gemini');

// Helper to calculate unique stats with individual passing thresholds
const getUniqueStats = (sessions, totalQuestions = 5, requiredScore = 60) => {
    const uniqueQuestions = new Map();
    sessions.forEach(s => {
        const qKey = s.questionId ? s.questionId.toString() : s.questionText;
        if (qKey) {
            const weights = { 'Easy': 1, 'Medium': 1.5, 'Hard': 2 };
            const weight = weights[s.difficulty] || 1;
            const rawScore = Math.round(s.score / weight);
            
            if (!uniqueQuestions.has(qKey) || uniqueQuestions.get(qKey) < rawScore) {
                uniqueQuestions.set(qKey, rawScore);
            }
        }
    });

    let passedCount = 0;
    uniqueQuestions.forEach((rawScore) => {
        if (rawScore >= requiredScore) {
            passedCount++;
        }
    });

    const count = Math.min(uniqueQuestions.size, totalQuestions);
    const cappedPassed = Math.min(passedCount, totalQuestions);
    const percentage = totalQuestions > 0 ? Math.min(Math.round((cappedPassed / totalQuestions) * 100), 100) : 0;
    
    let avgScore = 0;
    if (uniqueQuestions.size > 0) {
        const totalScore = Array.from(uniqueQuestions.values()).reduce((sum, score) => sum + score, 0);
        avgScore = Math.round(totalScore / uniqueQuestions.size);
    }
    
    return { count, passedCount: cappedPassed, percentage, avgScore };
};

// Helper to return high-quality fallback questions in case of API rate limits
const getLocalFallbackQuestions = (categoryName, difficulty, count) => {
    const easyQuestions = [
        { questionText: `Explain the difference between let, const, and var in JavaScript.`, idealAnswer: `var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned.` },
        { questionText: `What is the purpose of Semantic HTML tags?`, idealAnswer: `Semantic HTML tags (like <header>, <article>, <section>) provide meaning to web page structure, improving SEO and accessibility.` },
        { questionText: `What do HTTP status codes 200, 404, and 500 mean?`, idealAnswer: `200 indicates success (OK), 404 means the resource was not found, and 500 represents an internal server error.` },
        { questionText: `Explain the concept of responsive web design.`, idealAnswer: `Responsive web design uses fluid layouts, media queries, and flexible assets to adapt pages to different screen sizes.` },
        { questionText: `What is Git and why is it essential in modern software engineering?`, idealAnswer: `Git is a distributed version control system that enables developers to track changes, collaborate, and manage codebase history.` }
    ];

    const mediumQuestions = [
        { questionText: `What is CORS (Cross-Origin Resource Sharing) and how do you resolve it?`, idealAnswer: `CORS is a browser security feature restricting resource requests from other domains. Resolved by configuring Access-Control-Allow-Origin headers on the server.` },
        { questionText: `Explain how the JavaScript Event Loop works.`, idealAnswer: `JavaScript is single-threaded. The event loop continuously checks the call stack, pushing deferred callbacks from task queues once the stack is empty.` },
        { questionText: `What are the key differences between SQL and NoSQL databases?`, idealAnswer: `SQL databases are relational, structured, and use schemas. NoSQL databases are non-relational, flexible, and schema-less.` }
    ];

    const hardQuestions = [
        { questionText: `How would you design a rate limiter for a high-traffic API?`, idealAnswer: `Use a Redis-based token bucket or sliding window algorithm to track client request frequency and drop requests exceeding limits.` },
        { questionText: `Explain the CAP Theorem and its trade-offs in distributed systems.`, idealAnswer: `CAP theorem states a distributed system can guarantee at most two of Consistency, Availability, and Partition Tolerance. Under network partitions (P), a system must trade off between C and A.` }
    ];

    let source = easyQuestions;
    if (difficulty === 'Medium') source = mediumQuestions;
    if (difficulty === 'Hard') source = hardQuestions;

    return source.slice(0, count).map((q, idx) => ({
        _id: `fallback_${difficulty.toLowerCase()}_${idx}_${Date.now()}`,
        questionText: q.questionText,
        idealAnswer: q.idealAnswer,
        tips: ["Be precise in your technical vocabulary", "Structure your answer with key examples"],
        difficulty,
        categoryId: {
            name: categoryName
        }
    }));
};

// @route   GET /api/practice/status/:categoryId
// @desc    Get unlocked level for a category (passing each question threshold)
router.get('/status/:categoryId', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const category = await Category.findById(req.params.categoryId);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Fixed target count per level
        const totalQuestionsL1 = 5;
        const totalQuestionsL2 = 3;
        const totalQuestionsL3 = 2;

        const l1RequiredScore = 60; // Must score >= 60% on each question
        const l2RequiredScore = 50; // Must score >= 50% on each question
        const l3RequiredScore = 50; // Must score >= 50% on each question

        // Get Level 1 (Easy) stats
        const l1Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Easy'
        });
        const l1Stats = getUniqueStats(l1Sessions, totalQuestionsL1, l1RequiredScore);
        const l1Qualified = l1Stats.passedCount >= totalQuestionsL1;

        // Get Level 2 (Medium) stats
        const l2Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Medium'
        });
        const l2Stats = getUniqueStats(l2Sessions, totalQuestionsL2, l2RequiredScore);
        const l2Qualified = l2Stats.passedCount >= totalQuestionsL2;

        // Get Level 3 (Hard) stats
        const l3Sessions = await PracticeSession.find({
            userId,
            categoryName: category.name,
            difficulty: 'Hard'
        });
        const l3Stats = getUniqueStats(l3Sessions, totalQuestionsL3, l3RequiredScore);
        const l3Completed = l3Stats.passedCount >= totalQuestionsL3;

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
                    easyToMedium: `${totalQuestionsL1} questions with score >= ${l1RequiredScore}% each`, 
                    mediumToHard: `${totalQuestionsL2} questions with score >= ${l2RequiredScore}% each`
                },
                levelStats: {
                    l1: { attempted: l1Stats.passedCount, total: totalQuestionsL1, percentage: l1Stats.percentage, avgScore: l1Stats.avgScore, qualified: l1Qualified },
                    l2: { attempted: l2Stats.passedCount, total: totalQuestionsL2, percentage: l2Stats.percentage, avgScore: l2Stats.avgScore, qualified: l2Qualified },
                    l3: { attempted: l3Stats.passedCount, total: totalQuestionsL3, percentage: l3Stats.percentage, avgScore: l3Stats.avgScore, completed: l3Completed }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching practice status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/practice/reset/:categoryId
// @desc    Reset practice progress for a category
router.post('/reset/:categoryId', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Delete all practice sessions for this category name and user
        await PracticeSession.deleteMany({
            userId,
            categoryName: category.name
        });

        res.status(200).json({
            success: true,
            message: `Progress for category ${category.name} has been reset successfully.`
        });
    } catch (error) {
        console.error('Error resetting practice progress:', error);
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
            const l1Sessions = await PracticeSession.find({
                userId,
                categoryName: category.name,
                difficulty: 'Easy'
            });
            const l1Stats = getUniqueStats(l1Sessions, 5, 60);
            const l1Qualified = l1Stats.passedCount >= 5;
            
            if (!l1Qualified) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Unlock Level 2 by completing 5 questions with a score of at least 60% on each in Level 1` 
                });
            }
        }
        
        if (difficulty === 'Hard') {
            const l2Sessions = await PracticeSession.find({
                userId,
                categoryName: category.name,
                difficulty: 'Medium'
            });
            const l2Stats = getUniqueStats(l2Sessions, 3, 50);
            const l2Qualified = l2Stats.passedCount >= 3;
            
            if (!l2Qualified) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Unlock Level 3 by completing 3 questions with a score of at least 50% on each in Level 2` 
                });
            }
        }
        
        // Check DB for pre-seeded questions first (loads instantly)
        let questions = [];
        try {
            const filter = { isActive: true, difficulty, categoryId };
            questions = await Question.find(filter).populate('categoryId', 'name');
            
            // Fallback to Gemini AI if DB has no questions for this category
            if (questions.length === 0) {
                console.log('No pre-seeded questions in DB, generating dynamically via Gemini...');
                let questionsCount = 5;
                if (difficulty === 'Medium') questionsCount = 3;
                if (difficulty === 'Hard') questionsCount = 2;

                const rawQuestions = await generateAIQuestions(category.name, difficulty, questionsCount);
                questions = rawQuestions.map((q, idx) => ({
                    _id: `ai_${difficulty.toLowerCase()}_${idx}_${Date.now()}`,
                    questionText: q.questionText,
                    idealAnswer: q.idealAnswer,
                    tips: q.tips,
                    difficulty,
                    categoryId: {
                        _id: category._id,
                        name: category.name
                    }
                }));
            }
        } catch (err) {
            console.error('Failed to load questions from DB or Gemini:', err);
        }

        if (questions.length === 0) {
            console.log('No questions found, loading local fallback questions.');
            const questionsCount = difficulty === 'Easy' ? 5 : (difficulty === 'Medium' ? 3 : 2);
            questions = getLocalFallbackQuestions(category.name, difficulty, questionsCount);
        }
        
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
// @desc    Submit answer and get feedback evaluated via Gemini AI
// (Includes instant local evaluation for empty or too short answers)
router.post('/submit', protect, async (req, res) => {
    try {
        const { questionId, questionText, idealAnswer, categoryName, categoryId, answer } = req.body;

        let qText = questionText;
        let iAnswer = idealAnswer;
        let catName = categoryName;
        let catId = categoryId;
        let diff = 'Easy';

        // Extract attributes
        if (questionId && !questionId.startsWith('ai_')) {
            const question = await Question.findById(questionId).populate('categoryId', 'name');
            if (question) {
                qText = question.questionText;
                iAnswer = question.idealAnswer;
                catName = question.categoryId.name;
                catId = question.categoryId._id;
                diff = question.difficulty;
            }
        } else if (questionId && questionId.startsWith('ai_')) {
            // Decode difficulty from the dynamic ID prefix
            const parts = questionId.split('_');
            if (parts.length > 1) {
                diff = parts[1].charAt(0).toUpperCase() + parts[1].slice(1); // capitalize (easy -> Easy)
            }
        }

        if (!qText || !iAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Question text and ideal answer are required'
            });
        }

        // Fast-path: local check for empty or too short answers
        if (!answer || answer.trim().length < 5) {
            const sessionData = {
                userId: req.user.id,
                userAnswer: answer || '',
                score: 0,
                feedback: 'Your answer is empty or too short. Please provide a more complete response to receive feedback.',
                difficulty: diff,
                categoryName: catName,
                questionText: qText,
                idealAnswer: iAnswer
            };

            if (catId) {
                sessionData.categoryId = catId;
            }

            await PracticeSession.create(sessionData);

            return res.status(200).json({
                success: true,
                data: {
                    score: 0,
                    rawScore: 0,
                    feedback: 'Your answer is empty or too short. Please provide a more complete response to receive feedback.',
                    idealAnswer: iAnswer,
                    tips: req.body.tips || [],
                    difficulty: diff
                }
            });
        }

        // Evaluate user's answer using Gemini AI
        let score = 0;
        let feedback = '';

        try {
            const evaluation = await evaluateAIResponse({ questionText: qText, idealAnswer: iAnswer }, answer, diff);
            score = evaluation.score;
            feedback = evaluation.feedback;
        } catch (geminiError) {
            console.error('Gemini evaluation failed, falling back to keyword heuristics:', geminiError);
            const keywords = [];
            const result = generateFeedback(answer, keywords, diff);
            score = result.score;
            feedback = result.feedback + ' (Note: Evaluated via offline fallback)';
        }

        // Apply scoring weights
        const weights = { 'Easy': 1, 'Medium': 1.5, 'Hard': 2 };
        const weight = weights[diff] || 1;
        const weightedScore = Math.round(score * weight);

        // Save session in database
        const sessionData = {
            userId: req.user.id,
            userAnswer: answer,
            score: weightedScore,
            feedback,
            difficulty: diff,
            categoryName: catName,
            questionText: qText,
            idealAnswer: iAnswer
        };

        if (catId) {
            sessionData.categoryId = catId;
        }

        const session = await PracticeSession.create(sessionData);

        res.status(200).json({
            success: true,
            data: {
                score: weightedScore,
                rawScore: score,
                feedback,
                idealAnswer: iAnswer,
                tips: req.body.tips || [],
                difficulty: diff
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