import { generateJSONCompletion } from './groqService.js';

export const analyzeSentiment = async (comment, rating) => {
  const prompt = `Analyze the following hotel guest review and return a JSON object with sentiment metrics.

Review Comment: "${comment}"
Star Rating: ${rating}/5

Return ONLY a valid JSON object matching this structure:
{
  "sentimentScore": <number between -1.0 and 1.0, where -1 is extremely negative, 0 is neutral, 1 is extremely positive>,
  "sentimentCategory": "<'Positive' | 'Neutral' | 'Negative'>",
  "topics": [<array of key topics mentioned, e.g. "Cleanliness", "Service", "Value/Price", "Amenities", "Comfort", "Location", "Food", "Noise">],
  "suggestions": [<array of actionable improvement suggestions for management based on negative aspects, or empty array if purely positive>]
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are an AI customer intelligence analyzer for hotel management. Respond strictly in valid JSON format.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const result = await generateJSONCompletion(messages, { temperature: 0.1 });
    if (result && typeof result.sentimentScore === 'number') {
      return {
        sentimentScore: Math.min(1.0, Math.max(-1.0, Number(result.sentimentScore))),
        sentimentCategory: ['Positive', 'Neutral', 'Negative'].includes(result.sentimentCategory)
          ? result.sentimentCategory
          : rating >= 4 ? 'Positive' : rating <= 2 ? 'Negative' : 'Neutral',
        topics: Array.isArray(result.topics) ? result.topics : ['General'],
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      };
    }
  } catch (error) {
    console.error('Sentiment Analysis Error:', error.message);
  }

  const defaultCategory = rating >= 4 ? 'Positive' : rating <= 2 ? 'Negative' : 'Neutral';
  const defaultScore = rating >= 4 ? 0.7 : rating <= 2 ? -0.7 : 0.0;
  return {
    sentimentScore: defaultScore,
    sentimentCategory: defaultCategory,
    topics: ['General Experience'],
    suggestions: rating <= 3 ? ['Follow up with guest regarding service quality'] : [],
  };
};
