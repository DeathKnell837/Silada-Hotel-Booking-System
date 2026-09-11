import mongoose from 'mongoose';
import Room from '../models/Room.js';
import { generateAICompletion } from './aiService.js';

export const buildSystemPrompt = async () => {
  let roomDetailsText = '';
  try {
    if (mongoose.connection.readyState === 1) {
      const rooms = await Room.find({ isAvailable: true }).select('name type price capacity rating');
      if (rooms && rooms.length > 0) {
        roomDetailsText = rooms
          .map((r) => `- ${r.name} (${r.type}): ₱${r.price.toLocaleString()}/night, Max ${r.capacity} guests`)
          .join('\n');
      }
    }
  } catch (err) {
    console.error('Error fetching rooms for chatbot prompt:', err);
  }

  if (!roomDetailsText) {
    roomDetailsText = '- Deluxe Room: ₱5,500/night, Max 3 guests\n- Luxury Suite: ₱9,500/night, Max 4 guests\n- Presidential Suite: ₱18,000/night, Max 6 guests';
  }

  return `You are "Silada AI", the 24/7 Virtual Concierge for Silada Luxury Hotel & Resort.

Available Rooms & Live Rates:
${roomDetailsText}

Key Hotel Information:
- Check-in: 3:00 PM | Check-out: 12:00 PM
- Cancellation: Free cancellation up to 48 hours before check-in
- Payment: Credit/Debit Card, GCash, Maya, Bank Transfer, or Cash at check-in
- Included with stay: High-speed Wi-Fi, Pool & Fitness Center access, Complimentary Luxury Breakfast
- Location: Beachfront Boulevard, Paradise Cove | Contact: +63 (2) 8888-7777

STRICT CONCISENESS RULES:
1. EXTREMELY BRIEF: Keep responses strictly under 2 to 3 short sentences (or max 2 brief bullet points). Never send walls of text.
2. NO GIANT TABLES OR ESSAYS: Answer directly and concisely. Do NOT generate Markdown tables or multiple paragraphs.
3. ROOM RECOMMENDATIONS: Suggest only 1 or 2 best matching rooms with prices in ₱.
4. TONE: Warm, elegant, luxury hotel concierge style. Never overwhelm the guest with text.`;
};

export const chatWithAI = async (history = [], userMessage) => {
  const systemPrompt = await buildSystemPrompt();

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const aiReply = await generateAICompletion(formattedMessages, {
    temperature: 0.5,
    max_tokens: 500,
  });

  return aiReply;
};
