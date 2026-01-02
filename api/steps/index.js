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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phaseId, code, title, content, status, notes } = req.body;
    
    if (!phaseId || !code || !title) {
      return res.status(400).json({ error: 'phaseId, code, and title are required' });
    }
    
    const database = await getDatabase();
    
    // Check if step with same code already exists in this phase
    const existing = await database.collection('process_steps').findOne({ 
      phaseId,
      code 
    });
    
    if (existing) {
      return res.status(409).json({ error: 'Step with this code already exists in this phase' });
    }
    
    const newStep = {
      _id: code, // Use code as ID for consistency
      phaseId,
      code,
      title,
      content: content || '',
      status: status || 'pending',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await database.collection('process_steps').insertOne(newStep);
    
    res.status(201).json({ 
      success: true, 
      step: {
        id: newStep._id,
        code: newStep.code,
        title: newStep.title,
        content: newStep.content,
        status: newStep.status,
        notes: newStep.notes
      }
    });
  } catch (error) {
    console.error('Error creating step:', error);
    res.status(500).json({ error: 'Failed to create step' });
  }
}

