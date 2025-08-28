const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cabdb';
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log('Mongo connected');
  } catch (err) {
    console.warn('Mongo connect failed, falling back to in-memory server:', err.message);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    const memUri = mem.getUri();
    await mongoose.connect(memUri, { autoIndex: true });
    console.log('Mongo MemoryServer connected');
  }
}

module.exports = { connectMongo };
