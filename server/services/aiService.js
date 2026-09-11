import { generateCompletion as generateGroqCompletion, generateJSONCompletion as generateGroqJSONCompletion, getActiveGroqModel } from './groqService.js';
import { generateGeminiCompletion, generateGeminiJSONCompletion, DEFAULT_GEMINI_MODEL } from './geminiService.js';

export const getAIProviderConfig = () => {
  const explicitProvider = (process.env.AI_PROVIDER || 'auto').toLowerCase();
  const hasGroq = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here');
  const hasGemini = Boolean(
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') ||
    (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_google_api_key_here')
  );

  let primary = 'groq';
  if (explicitProvider === 'gemini') {
    primary = 'gemini';
  } else if (explicitProvider === 'groq') {
    primary = 'groq';
  } else {
    // auto mode: prefer whichever key is available
    if (hasGemini && !hasGroq) {
      primary = 'gemini';
    } else {
      primary = 'groq';
    }
  }

  return {
    primary,
    hasGroq,
    hasGemini,
    explicitProvider,
  };
};

/**
 * Returns current status of AI services for UI display & health check
 */
export const getAIStatus = () => {
  const { primary, hasGroq, hasGemini } = getAIProviderConfig();

  if (primary === 'gemini' && hasGemini) {
    return {
      provider: 'Google Gemini',
      model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
      status: 'online',
      hasGroq,
      hasGemini,
    };
  }

  if (hasGroq) {
    return {
      provider: 'Groq',
      model: getActiveGroqModel(),
      status: 'online',
      hasGroq,
      hasGemini,
    };
  }

  if (hasGemini) {
    return {
      provider: 'Google Gemini',
      model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
      status: 'online',
      hasGroq,
      hasGemini,
    };
  }

  return {
    provider: 'No Provider Configured',
    model: 'None',
    status: 'offline',
    hasGroq: false,
    hasGemini: false,
  };
};

/**
 * Generate a text completion with real API calls.
 * If APIs fail or are unconfigured, throws the real API error so failure is visible.
 */
export const generateAICompletion = async (messages, options = {}) => {
  const { primary, hasGroq, hasGemini } = getAIProviderConfig();
  let lastError = null;

  if (primary === 'gemini') {
    if (hasGemini) {
      try {
        return await generateGeminiCompletion(messages, options);
      } catch (err) {
        lastError = err;
        console.warn(`[AI Gateway] Gemini failed: ${err.message}. Trying Groq fallback...`);
      }
    }
    if (hasGroq) {
      try {
        return await generateGroqCompletion(messages, options);
      } catch (err) {
        lastError = err;
      }
    }
  } else {
    // Primary is Groq
    if (hasGroq) {
      try {
        return await generateGroqCompletion(messages, options);
      } catch (err) {
        lastError = err;
        console.warn(`[AI Gateway] Groq failed: ${err.message}. Trying Gemini fallback...`);
      }
    }
    if (hasGemini) {
      try {
        return await generateGeminiCompletion(messages, options);
      } catch (err) {
        lastError = err;
      }
    }
  }

  const errorMessage = lastError?.message || 'No valid AI API key configured (GROQ_API_KEY or GEMINI_API_KEY required).';
  throw new Error(`AI Service Error: ${errorMessage}`);
};

/**
 * Generate structured JSON completion with real API calls.
 * If APIs fail or are unconfigured, throws the real API error.
 */
export const generateAIJSONCompletion = async (messages, options = {}) => {
  const { primary, hasGroq, hasGemini } = getAIProviderConfig();
  let lastError = null;

  if (primary === 'gemini') {
    if (hasGemini) {
      try {
        return await generateGeminiJSONCompletion(messages, options);
      } catch (err) {
        lastError = err;
        console.warn(`[AI Gateway] Gemini JSON failed: ${err.message}. Trying Groq...`);
      }
    }
    if (hasGroq) {
      try {
        return await generateGroqJSONCompletion(messages, options);
      } catch (err) {
        lastError = err;
      }
    }
  } else {
    if (hasGroq) {
      try {
        return await generateGroqJSONCompletion(messages, options);
      } catch (err) {
        lastError = err;
        console.warn(`[AI Gateway] Groq JSON failed: ${err.message}. Trying Gemini...`);
      }
    }
    if (hasGemini) {
      try {
        return await generateGeminiJSONCompletion(messages, options);
      } catch (err) {
        lastError = err;
      }
    }
  }

  const errorMessage = lastError?.message || 'No valid AI API key configured for JSON generation.';
  throw new Error(`AI JSON Service Error: ${errorMessage}`);
};
