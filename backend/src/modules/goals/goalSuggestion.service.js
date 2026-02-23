const Goal = require('./Goal.model');

const generateGoalSuggestions = async (userId, responses) => {
    const suggestions = [];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Next two weeks

    if (responses.biggestChallenge && responses.biggestChallenge.toLowerCase().includes('team')) {
        suggestions.push({
            userId,
            title: 'Schedule a catch-up coffee with a team member',
            category: 'community',
            targetCount: 1,
            dueDate,
            isSuggested: true
        });
    }

    if (responses.supportNeeds && responses.supportNeeds.some(n => n.toLowerCase().includes('career'))) {
        suggestions.push({
            userId,
            title: 'Review career progression materials',
            category: 'career',
            targetCount: 1,
            dueDate,
            isSuggested: true
        });
    }

    if (responses.confidence && responses.confidence < 3) {
        suggestions.push({
            userId,
            title: 'Complete a confidence-building micro-learning module',
            category: 'learning',
            targetCount: 1,
            dueDate,
            isSuggested: true
        });
    }

    if (typeof responses.emotionalWellbeing === 'number' && responses.emotionalWellbeing < 3) {
        suggestions.push({
            userId,
            title: 'Complete 2 wellness check-ins this month',
            category: 'engagement',
            targetCount: 2,
            dueDate,
            isSuggested: true
        });
    }

    if (suggestions.length === 0) {
        suggestions.push({
            userId,
            title: 'Check out the Resource Library for 10 minutes',
            category: 'learning',
            targetCount: 1,
            dueDate,
            isSuggested: true
        });
    }

    // Save the suggested goals
    const createdGoals = await Goal.insertMany(suggestions);
    return createdGoals;
};

module.exports = {
    generateGoalSuggestions
};
