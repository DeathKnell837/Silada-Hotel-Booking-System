import User from './models/User.js';
import Room from './models/Room.js';

const rooms = [
  {
    name: 'Ocean View Standard',
    type: 'Standard',
    description:
      'A comfortable standard room with breathtaking ocean views. Designed with modern elegance, featuring premium linens and a private balcony perfect for watching the sunset.',
    price: 8500,
    capacity: 2,
    size: 320,
    bedType: 'Queen',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Ocean View', 'Mini Bar', 'Room Service'],
    rating: 4.3,
    numReviews: 28,
    isFeatured: false,
    isAvailable: true,
  },
  {
    name: 'Garden Retreat Standard',
    type: 'Standard',
    description:
      'A serene standard room overlooking our lush tropical gardens. Features contemporary decor with natural materials and warm lighting for a peaceful retreat.',
    price: 6500,
    capacity: 2,
    size: 300,
    bedType: 'Queen',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Garden View', 'TV', 'Safe'],
    rating: 4.1,
    numReviews: 42,
    isFeatured: false,
    isAvailable: true,
  },
  {
    name: 'Sapphire Deluxe Room',
    type: 'Deluxe',
    description:
      'An exquisite deluxe room adorned with sapphire accents and premium furnishings. Spacious layout with a separate seating area, walk-in rain shower, and panoramic city views.',
    price: 15500,
    capacity: 2,
    size: 450,
    bedType: 'King',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'City View', 'Mini Bar', 'Room Service', 'Bathrobe', 'Jacuzzi'],
    rating: 4.6,
    numReviews: 67,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Golden Deluxe Suite',
    type: 'Deluxe',
    description:
      'Wrapped in golden warmth, this deluxe room offers unparalleled luxury with handcrafted furniture, Italian marble bathroom, and floor-to-ceiling windows showcasing the coastline.',
    price: 18000,
    capacity: 3,
    size: 500,
    bedType: 'King',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Sea View', 'Mini Bar', 'Room Service', 'Spa Bath', 'Butler Service'],
    rating: 4.7,
    numReviews: 53,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Royal Heritage Suite',
    type: 'Suite',
    description:
      'A magnificent suite inspired by royal heritage, featuring a grand living room, dining area, master bedroom with canopy bed, and a private terrace with infinity pool views.',
    price: 30000,
    capacity: 4,
    size: 800,
    bedType: 'King',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
    ],
    amenities: [
      'WiFi', 'Air Conditioning', 'Pool View', 'Mini Bar', 'Room Service',
      'Butler Service', 'Spa Bath', 'Private Terrace', 'Dining Area',
    ],
    rating: 4.8,
    numReviews: 31,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Moonlight Suite',
    type: 'Suite',
    description:
      'An enchanting suite bathed in soft ambient lighting with a contemporary design. Features separate living quarters, premium entertainment system, and a luxurious soaking tub.',
    price: 27000,
    capacity: 3,
    size: 700,
    bedType: 'King',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
    ],
    amenities: [
      'WiFi', 'Air Conditioning', 'City View', 'Mini Bar', 'Room Service',
      'Entertainment System', 'Soaking Tub', 'Walk-in Closet',
    ],
    rating: 4.7,
    numReviews: 44,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'The Imperial Presidential',
    type: 'Presidential',
    description:
      'The crown jewel of Siladan — a palatial presidential suite spanning the entire top floor. Two master bedrooms, private chef kitchen, grand piano, personal cinema, rooftop infinity pool, and 360° panoramic views.',
    price: 65000,
    capacity: 6,
    size: 2000,
    bedType: 'King',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    amenities: [
      'WiFi', 'Air Conditioning', 'Panoramic View', 'Mini Bar', 'Room Service',
      'Butler Service', 'Private Pool', 'Chef Kitchen', 'Cinema Room',
      'Grand Piano', 'Helipad Access', 'Limousine Service',
    ],
    rating: 5.0,
    numReviews: 12,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Emerald Presidential Villa',
    type: 'Presidential',
    description:
      'An exclusive beachfront villa with private garden, outdoor dining pavilion, personal infinity pool, and direct beach access. Three luxurious bedrooms with en-suite bathrooms, a fully equipped gourmet kitchen, and 24/7 butler service.',
    price: 52000,
    capacity: 6,
    size: 1800,
    bedType: 'King',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    ],
    amenities: [
      'WiFi', 'Air Conditioning', 'Beach Access', 'Private Pool', 'Room Service',
      'Butler Service', 'Gourmet Kitchen', 'Garden', 'Outdoor Dining',
      'Spa Treatment Room', 'Limousine Service',
    ],
    rating: 4.9,
    numReviews: 18,
    isFeatured: true,
    isAvailable: true,
  },
];

const users = [
  {
    name: 'Admin Siladan',
    email: 'admin@siladan.com',
    password: 'admin123',
    phone: '+1 555-0100',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    phone: '+1 555-0101',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    phone: '+1 555-0102',
    role: 'user',
  },
];

export const seedDatabase = async () => {
  try {
    // Force reseed: clear and reseed to apply latest data
    const userCount = await User.countDocuments();
    const roomCount = await Room.countDocuments();

    if (userCount > 0 && roomCount > 0) {
      // Check if rooms need updating (e.g. fixed images)
      await Room.deleteMany({});
      await Room.create(rooms);
      console.log('🔄 Rooms refreshed with latest data');

      // Only skip user re-seed if users exist
      console.log('📦 Users already exist, skipping user seed...');
      return;
    }

    console.log('🌱 Seeding database...');

    if (userCount === 0) {
      await User.create(users);
      console.log('   ✅ Users created');
    }

    if (roomCount === 0) {
      await Room.create(rooms);
      console.log('   ✅ Rooms created');
    }

    console.log('🌱 Database seeded successfully!');
    console.log('   👤 Admin: admin@siladan.com / admin123');
    console.log('   👤 User:  john@example.com / user123');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};
