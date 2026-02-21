const ProgressSnapshot = require('./ProgressSnapshot.model');

const calculateDelta = (current, baseline) => {
    if (!baseline) return 0;
    const delta = ((current - baseline) / baseline) * 100;
    return Math.round(delta);
};

const updateProgressSnapshot = async (userId, weekNumber, responses) => {
    let snapshot = await ProgressSnapshot.findOne({ userId });
    if (!snapshot) {
        snapshot = new ProgressSnapshot({ userId, weeklyScores: [] });
    }

    const existingWeekIndex = snapshot.weeklyScores.findIndex(s => s.week === weekNumber);
    const newScoreObj = {
        week: weekNumber,
        confidence: responses.confidence || 0,
        workReadiness: responses.workReadiness || 0,
        emotionalWellbeing: responses.emotionalWellbeing || 0,
        recordedAt: new Date()
    };

    if (existingWeekIndex !== -1) {
        snapshot.weeklyScores[existingWeekIndex] = newScoreObj;
    } else {
        snapshot.weeklyScores.push(newScoreObj);
    }

    // Sort scores by week
    snapshot.weeklyScores.sort((a, b) => a.week - b.week);

    // Update current values
    const latestScore = snapshot.weeklyScores[snapshot.weeklyScores.length - 1];
    snapshot.currentConfidence = latestScore.confidence;
    snapshot.currentWellbeing = latestScore.emotionalWellbeing;
    snapshot.currentWorkReadiness = latestScore.workReadiness;

    // Calculate delta percentages vs week 1 score
    const week1Score = snapshot.weeklyScores[0];
    if (week1Score && snapshot.weeklyScores.length > 1) {
        snapshot.confidenceDelta = calculateDelta(snapshot.currentConfidence, week1Score.confidence);
        snapshot.wellbeingDelta = calculateDelta(snapshot.currentWellbeing, week1Score.emotionalWellbeing);
        snapshot.workReadinessDelta = calculateDelta(snapshot.currentWorkReadiness, week1Score.workReadiness);
    } else {
        snapshot.confidenceDelta = 0;
        snapshot.wellbeingDelta = 0;
        snapshot.workReadinessDelta = 0;
    }

    snapshot.lastUpdated = new Date();
    await snapshot.save();
    return snapshot;
};

const generateKeyInsights = (snapshot) => {
    if (!snapshot) return [];
    const insights = [];

    if (snapshot.confidenceDelta >= 50) {
        insights.push(`Your confidence has increased by ${snapshot.confidenceDelta}% over the past weeks.`);
    } else if (snapshot.confidenceDelta > 0) {
        insights.push(`Your confidence has increased by ${snapshot.confidenceDelta}%. Keep it up!`);
    } else if (snapshot.confidenceDelta < 0) {
        insights.push(`It's natural to have variations in confidence. Focus on small wins.`);
    }

    if (snapshot.wellbeingDelta > -10 && snapshot.wellbeingDelta < 10 && snapshot.weeklyScores.length > 1) {
        insights.push("You're showing steady progress in emotional wellbeing.");
    } else if (snapshot.wellbeingDelta >= 20) {
        insights.push(`Great job! Your emotional wellbeing has improved significantly.`);
    }

    if (snapshot.currentWorkReadiness >= 4.5) {
        insights.push("Your work readiness score is at an all-time high.");
    }

    if (insights.length === 0 && snapshot.weeklyScores.length > 0) {
        insights.push("You've started tracking your progress. Keep checking in!");
    }

    return insights;
};

module.exports = {
    calculateDelta,
    updateProgressSnapshot,
    generateKeyInsights
};
