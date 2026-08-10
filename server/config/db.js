import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import os from 'os';

let mongoServer;

const connectDB = async () => {
  try {
    let uri;

    if (process.env.MONGODB_URI) {
      uri = process.env.MONGODB_URI;
      await mongoose.connect(uri);
      console.log(`✅ MongoDB connected: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
    } else {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongodPath = path.join(os.homedir(), '.cache', 'mongodb-binaries', 'mongod.exe');

      if (fs.existsSync(mongodPath)) {
        mongoServer = await MongoMemoryServer.create({
          binary: {
            systemBinary: mongodPath,
          },
        });
      } else {
        mongoServer = await MongoMemoryServer.create({
          binary: {
            platform: 'win32',
            arch: 'x64',
            version: '7.0.5',
          },
        });
      }

      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`✅ MongoDB Memory Server connected: ${uri}`);
    }

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
