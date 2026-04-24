const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const PracticeSession = require('../models/PracticeSession');
const MockInterviewSession = require('../models/MockInterviewSession');
const Category = require('../models/Category');

// @route   GET /api/dashboard/combined-stats
// @desc    Get all stats for the dashboard
router.get('/combined-stats', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // --- Practice Stats ---
        const practiceSessions = await PracticeSession.find({ userId });
        const totalPracticeSessions = practiceSessions.length;
        const avgPracticeScore = totalPracticeSessions > 0 
            ? Math.round(practiceSessions.reduce((acc, s) => acc + s.score, 0) / totalPracticeSessions) 
            : 0;
        
        // Category-wise scores
        const categoryStats = {};
        practiceSessions.forEach(s => {
            if (!categoryStats[s.categoryName]) {
                categoryStats[s.categoryName] = { total: 0, count: 0 };
            }
            categoryStats[s.categoryName].total += s.score;
            categoryStats[s.categoryName].count += 1;
        });
        
        const categoryScores = Object.keys(categoryStats).map(cat => ({
            category: cat,
            avgScore: Math.round(categoryStats[cat].total / categoryStats[cat].count)
        }));

        // Practice Trend (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const practiceTrend = await PracticeSession.aggregate([
            { $match: { userId: req.user._id, createdAt: { $gte: sevenDaysAgo } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    avgScore: { $avg: "$score" },
                    count: { $sum: 1 }
                } 
            },
            { $sort: { "_id": 1 } }
        ]);

        // --- Mock Interview Stats ---
        const mockSessions = await MockInterviewSession.find({ userId });
        const totalMockInterviews = mockSessions.length;
        const avgConfidence = totalMockInterviews > 0 
            ? Math.round(mockSessions.reduce((acc, s) => acc + s.confidenceScore, 0) / totalMockInterviews) 
            : 0;
        const videoCount = mockSessions.filter(s => s.hasVideo).length;

        // Mock Trend (Last 7 days)
        const mockTrend = await MockInterviewSession.aggregate([
            { $match: { userId: req.user._id, createdAt: { $gte: sevenDaysAgo } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    avgConfidence: { $avg: "$confidenceScore" },
                    count: { $sum: 1 }
                } 
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({
            success: true,
            practice: {
                totalSessions: totalPracticeSessions,
                avgScore: avgPracticeScore,
                totalQuestions: totalPracticeSessions,
                categoryScores,
                trend: practiceTrend
            },
            mock: {
                totalInterviews: totalMockInterviews,
                avgConfidence,
                videoCount,
                trend: mockTrend
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/dashboard/performance-breakdown
// @desc    Get detailed performance breakdown by category and difficulty
router.get('/performance-breakdown', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Performance by category and difficulty
        const performanceData = await PracticeSession.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: { category: '$categoryName', difficulty: '$difficulty' },
                    avgScore: { $avg: '$score' },
                    count: { $sum: 1 },
                    highScore: { $max: '$score' },
                    lowScore: { $min: '$score' }
                }
            },
            { $sort: { '_id.category': 1, '_id.difficulty': 1 } }
        ]);

        // Performance summary
        const summary = {};
        performanceData.forEach(item => {
            const cat = item._id.category;
            if (!summary[cat]) {
                summary[cat] = [];
            }
            summary[cat].push({
                difficulty: item._id.difficulty,
                avgScore: Math.round(item.avgScore),
                attempts: item.count,
                highScore: item.highScore,
                lowScore: item.lowScore
            });
        });

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error fetching performance breakdown:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/dashboard/mock-interview-history
// @desc    Get mock interview history with details
router.get('/mock-interview-history', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = req.query.limit || 10;

        const mockSessions = await MockInterviewSession.find({ userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        const formattedSessions = mockSessions.map(session => ({
            id: session._id,
            interviewType: session.interviewType,
            date: session.createdAt,
            confidenceScore: session.confidenceScore,
            overallScore: session.overallScore,
            communicationScore: session.communicationScore,
            technicalScore: session.technicalScore,
            hasVideo: session.hasVideo,
            videoUrl: session.videoUrl,
            videoDuration: session.videoDuration,
            duration: session.duration,
            feedback: session.feedback,
            strengths: session.strengths || [],
            improvementAreas: session.improvementAreas || []
        }));

        res.status(200).json({
            success: true,
            data: formattedSessions
        });
    } catch (error) {
        console.error('Error fetching mock interview history:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/dashboard/confidence-tracking
// @desc    Get confidence level trend over time
router.get('/confidence-tracking', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Confidence trend from mock interviews
        const confidenceTrend = await MockInterviewSession.aggregate([
            { $match: { userId: req.user._id, createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    avgConfidence: { $avg: '$confidenceScore' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Overall confidence metrics
        const allMockSessions = await MockInterviewSession.find({ userId });
        const latestConfidence = allMockSessions.length > 0 
            ? allMockSessions[allMockSessions.length - 1].confidenceScore 
            : 0;
        
        const avgConfidence = allMockSessions.length > 0
            ? Math.round(allMockSessions.reduce((acc, s) => acc + s.confidenceScore, 0) / allMockSessions.length)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                trend: confidenceTrend,
                currentConfidence: latestConfidence,
                averageConfidence: avgConfidence,
                totalMockInterviews: allMockSessions.length
            }
        });
    } catch (error) {
        console.error('Error fetching confidence tracking:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/dashboard/recommendations
// @desc    Get AI-based recommendations for improvement
router.get('/recommendations', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const practiceSessions = await PracticeSession.find({ userId }).limit(100);
        const mockSessions = await MockInterviewSession.find({ userId });

        const recommendations = [];

        // Analyze category performance
        const categoryStats = {};
        practiceSessions.forEach(s => {
            if (!categoryStats[s.categoryName]) {
                categoryStats[s.categoryName] = { total: 0, count: 0 };
            }
            categoryStats[s.categoryName].total += s.score;
            categoryStats[s.categoryName].count += 1;
        });

        // Find weakest categories
        const categoryPerformance = Object.entries(categoryStats)
            .map(([cat, stats]) => ({
                category: cat,
                avgScore: stats.total / stats.count
            }))
            .sort((a, b) => a.avgScore - b.avgScore);

        if (categoryPerformance.length > 0) {
            const weakest = categoryPerformance[0];
            if (weakest.avgScore < 60) {
                recommendations.push({
                    type: 'weak-category',
                    title: `Focus on ${weakest.category}`,
                    description: `Your average score in ${weakest.category} is ${Math.round(weakest.avgScore)}%. Consider practicing more in this area.`,
                    priority: 'high',
                    score: weakest.avgScore
                });
            }
        }

        // Analyze confidence vs performance
        if (mockSessions.length > 0) {
            const avgConfidence = mockSessions.reduce((a, s) => a + s.confidenceScore, 0) / mockSessions.length;
            const avgMockScore = mockSessions.reduce((a, s) => a + (s.overallScore || 0), 0) / mockSessions.length;

            if (avgConfidence < avgMockScore - 10) {
                recommendations.push({
                    type: 'confidence-boost',
                    title: 'Build Confidence',
                    description: `Your mock interview scores (${Math.round(avgMockScore)}%) are higher than your confidence level (${Math.round(avgConfidence)}%). You're doing better than you think!`,
                    priority: 'medium',
                    score: avgConfidence
                });
            }

            if (avgMockScore < 50) {
                recommendations.push({
                    type: 'performance-improvement',
                    title: 'Intensive Practice Needed',
                    description: 'Your mock interview scores suggest you need more targeted practice. Focus on technical fundamentals.',
                    priority: 'high',
                    score: avgMockScore
                });
            }
        }

        // Check practice frequency
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentPractice = practiceSessions.filter(s => s.createdAt > sevenDaysAgo).length;

        if (recentPractice < 5) {
            recommendations.push({
                type: 'frequency',
                title: 'Increase Practice Frequency',
                description: 'You\'ve had less than 5 practice sessions in the last week. Regular practice leads to better results.',
                priority: 'medium'
            });
        }

        // Interview type recommendations
        if (mockSessions.length > 0) {
            const interviewTypes = {};
            mockSessions.forEach(s => {
                if (!interviewTypes[s.interviewType]) {
                    interviewTypes[s.interviewType] = { count: 0, total: 0 };
                }
                interviewTypes[s.interviewType].count++;
                interviewTypes[s.interviewType].total += s.confidenceScore;
            });

            const types = Object.entries(interviewTypes)
                .map(([type, data]) => ({
                    type,
                    count: data.count,
                    avgConfidence: data.total / data.count
                }))
                .sort((a, b) => a.avgConfidence - b.avgConfidence);

            if (types.length > 0 && types[0].avgConfidence < 50) {
                recommendations.push({
                    type: 'interview-type',
                    title: `Improve ${types[0].type} Interviews`,
                    description: `Your ${types[0].type} interview confidence is low. Consider focusing practice on this interview style.`,
                    priority: 'high',
                    score: types[0].avgConfidence
                });
            }
        }

        // Video recording recommendation
        if (mockSessions.length > 0) {
            const videoDone = mockSessions.filter(s => s.hasVideo).length;
            if (videoDone === 0) {
                recommendations.push({
                    type: 'video-recording',
                    title: 'Record Your Interviews',
                    description: 'Recording and reviewing your mock interviews helps identify communication and presentation issues.',
                    priority: 'medium'
                });
            }
        }

        res.status(200).json({
            success: true,
            data: recommendations.sort((a, b) => {
                const priorityMap = { 'high': 0, 'medium': 1, 'low': 2 };
                return priorityMap[a.priority] - priorityMap[b.priority];
            })
        });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
