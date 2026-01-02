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
    const { startDate, endDate, userId } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    
    const logs = await database.collection('process_time_logs').find(query).toArray();
    
    let totalSeconds = 0;
    const byCategory = {};
    const byPhase = {};
    const byStep = {};
    const byClient = {};
    const byDate = {};
    
    const clients = await database.collection('process_clients').find({}).toArray();
    const clientMap = {};
    clients.forEach(c => { clientMap[c._id] = c.name; });
    
    logs.forEach(log => {
      totalSeconds += log.seconds;
      
      if (!byCategory[log.categoryId]) {
        byCategory[log.categoryId] = { seconds: 0, hours: 0, categoryTitle: log.categoryTitle };
      }
      byCategory[log.categoryId].seconds += log.seconds;
      byCategory[log.categoryId].hours = byCategory[log.categoryId].seconds / 3600;
      
      if (!byPhase[log.phaseId]) {
        byPhase[log.phaseId] = { seconds: 0, hours: 0, phaseTitle: log.phaseTitle };
      }
      byPhase[log.phaseId].seconds += log.seconds;
      byPhase[log.phaseId].hours = byPhase[log.phaseId].seconds / 3600;
      
      if (!byStep[log.stepId]) {
        byStep[log.stepId] = { seconds: 0, hours: 0, stepTitle: log.stepTitle };
      }
      byStep[log.stepId].seconds += log.seconds;
      byStep[log.stepId].hours = byStep[log.stepId].seconds / 3600;
      
      const clientId = log.clientId || 'no-client';
      if (!byClient[clientId]) {
        byClient[clientId] = { seconds: 0, hours: 0, clientName: clientMap[clientId] || 'No Client' };
      }
      byClient[clientId].seconds += log.seconds;
      byClient[clientId].hours = byClient[clientId].seconds / 3600;
      
      if (!byDate[log.date]) {
        byDate[log.date] = { seconds: 0, hours: 0 };
      }
      byDate[log.date].seconds += log.seconds;
      byDate[log.date].hours = byDate[log.date].seconds / 3600;
    });
    
    res.json({
      totalSeconds,
      totalHours: totalSeconds / 3600,
      byCategory,
      byPhase,
      byStep,
      byClient,
      byDate,
    });
  } catch (error) {
    console.error('Error fetching time summary:', error);
    res.status(500).json({ error: 'Failed to fetch time summary' });
  }
}


