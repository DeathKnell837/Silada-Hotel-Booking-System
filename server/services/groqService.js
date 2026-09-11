import { Groq } from 'groq-sdk';

export const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('Groq API Key is not configured (GROQ_API_KEY).');
  }
  return new Groq({ apiKey });
};

export const groq = new Proxy({}, {
  get(target, prop) {
    return getGroqClient()[prop];
  }
});

export const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
].filter(Boolean);

let activeGroqModel = CANDIDATE_MODELS[0] || 'openai/gpt-oss-120b';

export const getActiveGroqModel = () => activeGroqModel;

export const DEFAULT_MODEL = activeGroqModel;

/**
 * Checks if an error indicates that the requested model is missing or deprecated
 */
const isModelNotFoundError = (error) => {
  const msg = (error?.message || '').toLowerCase();
  const code = error?.error?.code || '';
  return (
    error?.status === 404 ||
    code === 'model_not_found' ||
    msg.includes('does not exist') ||
    msg.includes('not found') ||
    msg.includes('decommissioned')
  );
};

/**
 * Generate a text response using Groq with automatic model fallback
 */
export const generateCompletion = async (messages, options = {}) => {
  const modelsToTry = [
    options.model || activeGroqModel,
    ...CANDIDATE_MODELS.filter((m) => m !== (options.model || activeGroqModel)),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens || 1024,
      });

      activeGroqModel = model;
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      lastError = error;
      if (isModelNotFoundError(error)) {
        console.warn(`[Groq] Model "${model}" is unavailable or removed. Falling back to alternative...`);
        continue;
      }
      // If it's another error (auth, rate limit), log and throw
      console.error('Groq API Error:', error.message);
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  console.error('Groq API Error (all candidate models failed):', lastError?.message);
  throw new Error(`AI Service Error: ${lastError?.message || 'No available Groq models'}`);
};

/**
 * Generate structured JSON response using Groq with automatic model fallback
 */
export const generateJSONCompletion = async (messages, options = {}) => {
  const modelsToTry = [
    options.model || activeGroqModel,
    ...CANDIDATE_MODELS.filter((m) => m !== (options.model || activeGroqModel)),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: messages,
        temperature: options.temperature ?? 0.2,
        response_format: { type: 'json_object' },
      });

      activeGroqModel = model;
      const content = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      lastError = error;
      if (isModelNotFoundError(error)) {
        console.warn(`[Groq JSON] Model "${model}" is unavailable or removed. Falling back...`);
        continue;
      }
      console.error('Groq JSON API Error:', error.message);
      throw new Error(`AI JSON Service Error: ${error.message}`);
    }
  }

  throw new Error(`AI JSON Service Error: ${lastError?.message || 'All Groq models failed'}`);
};
