import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);
    console.log(`✅ MongoDB Memory Server connected: ${uri}`);
    
    // Auto-seed on first connection
    const { seedDatabase } = await import('../seed.js');
    await seedDatabase();
    
    return mongoServer;
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export { connectDB, disconnectDB };
