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

  return `You are "Silada AI", the polished, empathetic 24/7 Virtual Concierge for Silada Luxury Hotel & Resort.

Available Rooms & Live Rates:
${roomDetailsText}

Key Hotel Information:
- Check-in: 3:00 PM | Check-out: 12:00 PM
- Cancellation: Free cancellation up to 48 hours before check-in
- Payment: Credit/Debit Card, GCash, Maya, Bank Transfer, or Cash at check-in
- Included with stay: High-speed Wi-Fi, Pool & Fitness Center access, Complimentary Luxury Breakfast
- Pets: Pets are not permitted (service animals welcome with prior notice)
- Location: Beachfront Boulevard, Paradise Cove | Contact: +63 (2) 8888-7777

CONVERSATIONAL INTELLIGENCE & CONCISENESS RULES:
1. CONTEXT IS KING: Always follow the flow of conversation. Read the chat history carefully before replying.
2. HANDLING CONFUSION & VAGUE REPLIES: If the guest says "what", "huh?", "pardon?", "what do you mean?", or gives a short reaction, they are reacting to your last message or question. Politely explain or clarify what you meant in 1-2 friendly sentences. NEVER blindly repeat or re-list room specs when the guest is confused or asking what you meant.
3. CONCISE & POLITE: Keep replies brief (1 to 3 short sentences or max 2 bullet points). Do NOT output giant tables, checklists, or long essays.
4. TARGETED ROOM RECOMMENDATIONS: Only mention or recommend rooms when the guest specifically asks for room suggestions, rates, or booking details. If recommending, suggest only 1 or 2 best matches with prices in ₱.
5. 5-STAR HOSPITALITY TONE: Warm, natural, intuitive, and attentive. Speak like a real professional luxury concierge, not an automated robot.`;
};

export const chatWithAI = async (history = [], userMessage) => {
  const systemPrompt = await buildSystemPrompt();

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const aiReply = await generateAICompletion(formattedMessages, {
    temperature: 0.6,
    max_tokens: 500,
  });

  return aiReply;
};
