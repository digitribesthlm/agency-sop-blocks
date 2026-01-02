import { MongoClient } from 'mongodb';

let client = null;
let db = null;

async function getDatabase() {
  if (db) return db;
  
  const uri = process.env.MONGODB_URL_TASK_MANAGER;
  const dbName = process.env.DATABASE_NAME_TASK_MANAGER;
  
  if (!uri || !dbName) {
    throw new Error('MongoDB not configured');
  }
  
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const database = await getDatabase();
    const clients = await database.collection('process_clients')
      .find({})
      .sort({ name: 1 })
      .toArray();
    
    const result = clients.map(client => ({
      id: client._id,
      name: client.name,
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
}


