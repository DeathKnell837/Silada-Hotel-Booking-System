import { GoogleGenAI } from '@google/genai';

export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Format OpenAI-style messages array to Gemini contents and systemInstruction
 */
const formatMessagesForGemini = (messages = []) => {
  let systemInstruction = '';
  const contents = [];

  for (const m of messages) {
    if (m.role === 'system') {
      systemInstruction += (systemInstruction ? '\n\n' : '') + m.content;
    } else {
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }],
      });
    }
  }

  // Gemini requires at least one user content
  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
  }

  return { systemInstruction, contents };
};

/**
 * Generate a text response using Google Gemini
 */
export const generateGeminiCompletion = async (messages, options = {}) => {
  const client = getClient();
  if (!client) {
    throw new Error('Gemini API Key is not configured (GEMINI_API_KEY).');
  }

  const { systemInstruction, contents } = formatMessagesForGemini(messages);
  const model = options.model || DEFAULT_GEMINI_MODEL;

  try {
    const config = {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.max_tokens || 1024,
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await client.models.generateContent({
      model,
      contents,
      config,
    });

    return response.text || '';
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error(`Gemini Service Error: ${error.message}`);
  }
};

/**
 * Generate structured JSON response using Google Gemini
 */
export const generateGeminiJSONCompletion = async (messages, options = {}) => {
  const client = getClient();
  if (!client) {
    throw new Error('Gemini API Key is not configured (GEMINI_API_KEY).');
  }

  const { systemInstruction, contents } = formatMessagesForGemini(messages);
  const model = options.model || DEFAULT_GEMINI_MODEL;

  try {
    const config = {
      temperature: options.temperature ?? 0.1,
      responseMimeType: 'application/json',
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await client.models.generateContent({
      model,
      contents,
      config,
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini JSON API Error:', error.message);
    throw new Error(`Gemini JSON Service Error: ${error.message}`);
  }
};
