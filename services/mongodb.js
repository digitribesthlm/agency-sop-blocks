import { MongoClient } from 'mongodb';

let client = null;
let db = null;

function getMongoUri() {
  return process.env.MONGODB_URL_TASK_MANAGER;
}

function getDbName() {
  return process.env.DATABASE_NAME_TASK_MANAGER;
}

export async function connectToMongoDB() {
  if (client && db) {
    return { client, db };
  }

  const MONGODB_URI = getMongoUri();
  const DB_NAME = getDbName();

  if (!MONGODB_URI) {
    throw new Error('MongoDB connection string is not configured. Please set MONGODB_URL_TASK_MANAGER.');
  }

  if (!DB_NAME) {
    throw new Error('Database name is not configured. Please set DATABASE_NAME_TASK_MANAGER.');
  }

  try {
    // Create client without database in URI to avoid conflicts
    const uriWithoutDb = MONGODB_URI.split('?')[0].replace(/\/[^\/]+$/, '') + (MONGODB_URI.includes('?') ? '?' + MONGODB_URI.split('?')[1] : '');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    // Force a fresh query
    const testCount = await db.collection('process_categories').countDocuments({});
    console.log('Immediate count test:', testCount);
    
    if (testCount === 0) {
      // Try to see what collections actually have data
      const allCollections = await db.listCollections().toArray();
      for (const coll of allCollections.filter(c => c.name.startsWith('process_'))) {
        const collCount = await db.collection(coll.name).countDocuments({});
        // Collection available
      }
    }
    
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToMongoDB();
  }
  return db;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

