import mongoose from 'mongoose';

let mongoServer;

const connectDB = async () => {
  try {
    let uri;

    // Use real MongoDB if MONGODB_URI is provided (production), otherwise use Memory Server
    if (process.env.MONGODB_URI) {
      uri = process.env.MONGODB_URI;
      await mongoose.connect(uri);
      console.log(`✅ MongoDB connected: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
    } else {
      // Only import MongoMemoryServer when needed (local development)
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`✅ MongoDB Memory Server connected: ${uri}`);
    }
    
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
