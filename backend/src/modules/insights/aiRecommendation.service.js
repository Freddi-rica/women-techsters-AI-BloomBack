const AIRecommendation = require('./AIRecommendation.model');
const Resource = require('../resources/Resource.model');

const generateAIRecommendation = async (user, checkIns) => {
    // Collect last 4 check-in responses + user profile (role, journey stage)
    const userData = {
        role: user.role || 'employee',
        stage: checkIns[0]?.journeyStage || 'unknown',
        checkIns: checkIns.map(c => ({
            scores: c.responses,
            challenge: c.responses?.biggestChallenge,
            supportNeeds: c.responses?.supportNeeds
        }))
    };

    const resources = await Resource.find({}).select('title tags type');
    const availableResources = resources.map(r => ({ id: r._id, title: r.title, tags: r.tags }));

    const prompt = `
System: You are a maternity leave support advisor. 
Based on this user's check-in data, recommend exactly 4 resources 
in this priority order: most_urgent, secondary, preventive, community.
Return JSON only.

User data: ${JSON.stringify(userData)}
Available resources: ${JSON.stringify(availableResources)}

Return format:
{
  "recommendations": [
    { "priority": "most_urgent", "resourceId": "resource_id", "whyThisHelps": "...", "tags": ["..."] }
  ]
}`;

    const apiKey = process.env.AI_API_KEY;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o', // or gpt-3.5-turbo if 4o is not accessible
                messages: [{ role: 'system', content: prompt }],
                response_format: { type: 'json_object' }
            }),
            signal: AbortSignal.timeout(30000) // 30-second timeout
        });

        if (!response.ok) {
            throw new Error(`AI API returned ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsedData = JSON.parse(content);

        return parsedData.recommendations;

    } catch (error) {
        console.error("Error calling AI API:", error.message);
        throw new Error("Failed to generate AI recommendations");
    }
};

module.exports = {
    generateAIRecommendation
};
