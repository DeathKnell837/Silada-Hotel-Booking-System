import ChatHistory from '../models/ChatHistory.js';
import { chatWithAI } from '../services/chatbotService.js';

export const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ message: 'Session ID and message are required' });
    }

    let chat = await ChatHistory.findOne({ sessionId });
    if (!chat) {
      chat = new ChatHistory({
        sessionId,
        user: req.user ? req.user._id : null,
        messages: [],
      });
    }

    const historyForAI = chat.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const replyText = await chatWithAI(historyForAI, message);

    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: replyText });

    if (req.user && !chat.user) {
      chat.user = req.user._id;
    }

    await chat.save();

    res.json({
      sessionId,
      reply: replyText,
      messages: chat.messages,
    });
  } catch (error) {
    console.error('Chatbot Controller Error:', error);
    res.status(500).json({ message: error.message || 'Chatbot service error' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chat = await ChatHistory.findOne({ sessionId });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await ChatHistory.deleteOne({ sessionId });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
