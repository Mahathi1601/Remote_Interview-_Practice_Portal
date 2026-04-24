/**
 * Generates feedback based on the user's answer and ideal answer keywords
 * @param {string} answer - User's answer
 * @param {Array} keywords - Keywords that should be present
 * @returns {Object} - Feedback and calculated score
 */
const generateFeedback = (answer, keywords = [], difficulty = 'easy') => {
    let score = 0;
    const foundKeywords = [];
    
    // Normalize difficulty weight
    const weights = {
        'easy': 1,
        'medium': 1.5,
        'hard': 2
    };
    const difficultyWeight = weights[difficulty.toLowerCase()] || 1;

    // Check keywords
    if (keywords && keywords.length > 0) {
        keywords.forEach(keyword => {
            if (answer.toLowerCase().includes(keyword.toLowerCase())) {
                foundKeywords.push(keyword);
            }
        });
        
        const keywordPercentage = (foundKeywords.length / keywords.length);
        score += keywordPercentage * 60; // Up to 60 points for keywords
    } else {
        // Fallback if no keywords
        score += Math.min(answer.length / 5, 60);
    }

    // Check length and structure
    if (answer.length > 50) score += 20;
    if (answer.length > 200) score += 10;
    if (answer.match(/example|specifically|instance/i)) score += 10;

    // Apply difficulty weight to the base 100 score (then capped if needed)
    // Actually, usually weights apply to the "value" of the session.
    // For simplicity, we'll keep the internal score 0-100 and apply weight in the session router
    
    let feedbackText = '';
    if (score >= 80) {
        feedbackText = "Excellent answer! You've covered all the key points and provided good detail.";
    } else if (score >= 60) {
        feedbackText = "Good effort. Try to include more specific technical keywords and examples from your experience.";
    } else {
        feedbackText = "Your answer seems incomplete. Focus on explaining the core concepts and using relevant industry terminology.";
    }

    if (foundKeywords.length < keywords.length / 2) {
        feedbackText += " Hint: Try to mention " + keywords.filter(k => !foundKeywords.includes(k)).slice(0, 3).join(', ') + ".";
    }

    return {
        score: Math.round(score),
        feedback: feedbackText,
        foundKeywords
    };
};

module.exports = { generateFeedback };
