import Room from '../models/Room.js';
import { generateAICompletion } from './aiService.js';

export const buildSystemPrompt = async () => {
  let roomDetailsText = '';
  try {
    const rooms = await Room.find({ isAvailable: true }).select('name type price capacity bedType size amenities rating description');
    roomDetailsText = rooms.map(r => 
      `- ${r.name} (${r.type}): ₱${r.price.toLocaleString()}/night, Max ${r.capacity} guests, Bed: ${r.bedType}, Size: ${r.size} sq ft, Rating: ${r.rating}/5 ⭐. Amenities: ${r.amenities.join(', ')}. Description: ${r.description}`
    ).join('\n');
  } catch (err) {
    console.error('Error fetching rooms for chatbot prompt:', err);
    roomDetailsText = 'Rooms currently available: Standard, Deluxe, Suite, Presidential.';
  }

  return `You are "Silada AI", the friendly 24/7 Virtual Concierge for Silada Luxury Hotel & Resort.

Hotel Overview:
Silada Hotel is a premier 5-star luxury hotel offering world-class hospitality, elegant accommodations, fine dining, spa wellness, and modern booking conveniences.

Current Available Rooms & Live Rates:
${roomDetailsText}

Hotel Policies & Info:
- Check-in time: 3:00 PM | Check-out time: 12:00 PM
- Payment Methods: Credit/Debit Card (Stripe), GCash, Maya, Bank Transfer, or Cash upon Check-in
- Cancellation Policy: Free cancellation up to 48 hours before check-in.
- Amenities Included: High-speed Wi-Fi, Swimming Pool access, Fitness Center, 24/7 Room Service, Complimentary Breakfast.
- Address: Beachfront Boulevard, Paradise Cove, City Center.
- Contact Email: support@siladahotel.com | Phone: +63 (2) 8888-7777

Your Responsibilities:
1. Assist guests warmly and professionally with inquiries about room options, pricing, amenities, check-in/out, policies, and special requests.
2. Recommend the best room based on the guest's needs (e.g. budget, number of guests, desired amenities).
3. Guide guests on how to book rooms on the Silada website (direct them to the /rooms or /rooms/:id page).
4. Be concise, polite, helpful, and luxury-oriented in your tone. Use formatting like bullet points when listing rooms. Always state prices in Philippine Pesos (₱).`;
};

export const chatWithAI = async (history = [], userMessage) => {
  const systemPrompt = await buildSystemPrompt();

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    })),
    { role: 'user', content: userMessage }
  ];

  const aiReply = await generateAICompletion(formattedMessages, {
    temperature: 0.7,
    max_tokens: 800
  });

  return aiReply;
};
