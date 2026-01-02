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
    const { categoryId, title, description, phaseNumber } = req.body;
    
    if (!categoryId || !title || phaseNumber === undefined) {
      return res.status(400).json({ error: 'categoryId, title, and phaseNumber are required' });
    }
    
    const database = await getDatabase();
    
    // Generate phase ID
    const phaseId = `${categoryId}-p${phaseNumber}`;
    
    // Check if phase with same number already exists in this category
    const existing = await database.collection('process_phases').findOne({ 
      categoryId,
      phaseNumber 
    });
    
    if (existing) {
      return res.status(409).json({ error: 'Phase with this number already exists in this category' });
    }
    
    const newPhase = {
      _id: phaseId,
      categoryId,
      title,
      description: description || '',
      phaseNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await database.collection('process_phases').insertOne(newPhase);
    
    res.status(201).json({ 
      success: true, 
      phase: {
        id: newPhase._id,
        categoryId: newPhase.categoryId,
        title: newPhase.title,
        description: newPhase.description,
        phaseNumber: newPhase.phaseNumber
      }
    });
  } catch (error) {
    console.error('Error creating phase:', error);
    res.status(500).json({ error: 'Failed to create phase' });
  }
}

