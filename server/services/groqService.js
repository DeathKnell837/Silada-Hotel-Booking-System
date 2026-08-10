import { Groq } from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
export const groq = new Groq({ apiKey: apiKey || 'gsk_placeholder' });

export const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

/**
 * Generate a text response using Groq
 */
export const generateCompletion = async (messages, options = {}) => {
  try {
    const completion = await groq.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens || 1024,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API Error:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

/**
 * Generate structured JSON response using Groq
 */
export const generateJSONCompletion = async (messages, options = {}) => {
  try {
    const completion = await groq.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: messages,
      temperature: options.temperature ?? 0.2,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq JSON API Error:', error.message);
    return null;
  }
};
