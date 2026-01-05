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

function transformCategory(doc) {
  return {
    id: doc._id,
    title: doc.title,
    icon: doc.icon,
    description: doc.description,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : (doc.updatedAt || new Date().toISOString()),
    phases: []
  };
}

function transformPhase(doc) {
  return {
    id: doc._id,
    title: doc.title,
    phaseNumber: doc.phaseNumber,
    description: doc.description,
    steps: []
  };
}

function transformStep(doc) {
  return {
    id: doc._id,
    code: doc.code,
    title: doc.title,
    content: doc.content || '',
    status: doc.status || 'pending',
    notes: doc.notes || '',
    icon: doc.icon
  };
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
    
    const categories = await database.collection('process_categories').find({}).toArray();
    const phases = await database.collection('process_phases').find({}).toArray();
    const steps = await database.collection('process_steps').find({}).toArray();
    
    if (categories.length === 0) {
      console.warn('No categories found in process_categories collection');
    }
    
    const result = categories.map(catDoc => {
      const category = transformCategory(catDoc);
      
      const categoryPhases = phases
        .filter(phase => phase.categoryId === category.id)
        .sort((a, b) => a.phaseNumber - b.phaseNumber)
        .map(phaseDoc => {
          const phase = transformPhase(phaseDoc);
          
          const phaseSteps = steps
            .filter(step => step.phaseId === phase.id)
            .sort((a, b) => {
              const aParts = a.code.split('.').map(Number);
              const bParts = b.code.split('.').map(Number);
              for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                const aVal = aParts[i] || 0;
                const bVal = bParts[i] || 0;
                if (aVal !== bVal) return aVal - bVal;
              }
              return 0;
            })
            .map(stepDoc => transformStep(stepDoc));
          
          phase.steps = phaseSteps;
          return phase;
        });
      
      category.phases = categoryPhases;
      return category;
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
}


