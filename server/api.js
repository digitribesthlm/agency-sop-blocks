import express from 'express';
import cors from 'cors';
import { getDatabase } from '../services/mongodb.js';

const router = express.Router();

// Login endpoint
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await getDatabase();
    const user = await db.collection('process_users').findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // String comparison for password (as requested)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: {
        _id: userWithoutPassword._id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        clientId: userWithoutPassword.clientId,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Transform MongoDB document to app format
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

// Get all categories with phases and steps
router.get('/categories', async (req, res) => {
  try {
    const db = await getDatabase();
    
    console.log(`Connected to database: ${db.databaseName}`);
    
    // Verify we can query the collection
    const count = await db.collection('process_categories').countDocuments({});
    console.log('process_categories count:', count);
    
    if (count === 0) {
      // Try listing all documents to see what's there
      const allDocs = await db.collection('process_categories').find({}).limit(5).toArray();
      console.log('Sample documents:', allDocs.length, allDocs);
    }
    
    const categories = await db.collection('process_categories').find({}).toArray();
    const phases = await db.collection('process_phases').find({}).toArray();
    const steps = await db.collection('process_steps').find({}).toArray();
    
    console.log(`Found ${categories.length} categories, ${phases.length} phases, ${steps.length} steps`);
    
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
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      message: error.message 
    });
  }
});

// Get a single category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const { id } = req.params;
    
    const category = await db.collection('process_categories').findOne({ _id: id });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const phases = await db.collection('process_phases')
      .find({ categoryId: id })
      .sort({ phaseNumber: 1 })
      .toArray();
    
    const phaseIds = phases.map(p => p._id);
    const steps = await db.collection('process_steps')
      .find({ phaseId: { $in: phaseIds } })
      .toArray();
    
    const result = transformCategory(category);
    result.phases = phases.map(phaseDoc => {
      const phase = transformPhase(phaseDoc);
      phase.steps = steps
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
      return phase;
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Update a step
router.put('/categories/:categoryId/phases/:phaseId/steps/:stepId', async (req, res) => {
  try {
    const db = await getDatabase();
    const { stepId } = req.params;
    const updates = req.body;
    
    const updateDoc = {
      ...updates,
      updatedAt: new Date()
    };
    
    const result = await db.collection('process_steps').updateOne(
      { _id: stepId },
      { $set: updateDoc }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Step not found' });
    }
    
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// Time tracking endpoints
router.post('/time-tracking/log', async (req, res) => {
  try {
    const db = await getDatabase();
    const log = {
      ...req.body,
      createdAt: new Date(),
    };
    
    await db.collection('process_time_logs').insertOne(log);
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging time:', error);
    res.status(500).json({ error: 'Failed to log time' });
  }
});

router.get('/time-tracking/summary', async (req, res) => {
  try {
    const db = await getDatabase();
    const { startDate, endDate, userId } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    
    const logs = await db.collection('process_time_logs').find(query).toArray();
    
    // Calculate summary
    let totalSeconds = 0;
    const byCategory = {};
    const byPhase = {};
    const byStep = {};
    const byClient = {};
    const byDate = {};
    
    // Get client names
    const clients = await db.collection('process_clients').find({}).toArray();
    const clientMap = {};
    clients.forEach(c => { clientMap[c._id] = c.name; });
    
    logs.forEach(log => {
      totalSeconds += log.seconds;
      
      // By category
      if (!byCategory[log.categoryId]) {
        byCategory[log.categoryId] = { seconds: 0, hours: 0, categoryTitle: log.categoryTitle };
      }
      byCategory[log.categoryId].seconds += log.seconds;
      byCategory[log.categoryId].hours = byCategory[log.categoryId].seconds / 3600;
      
      // By phase
      if (!byPhase[log.phaseId]) {
        byPhase[log.phaseId] = { seconds: 0, hours: 0, phaseTitle: log.phaseTitle };
      }
      byPhase[log.phaseId].seconds += log.seconds;
      byPhase[log.phaseId].hours = byPhase[log.phaseId].seconds / 3600;
      
      // By step
      if (!byStep[log.stepId]) {
        byStep[log.stepId] = { seconds: 0, hours: 0, stepTitle: log.stepTitle };
      }
      byStep[log.stepId].seconds += log.seconds;
      byStep[log.stepId].hours = byStep[log.stepId].seconds / 3600;
      
      // By client
      const clientId = log.clientId || 'no-client';
      if (!byClient[clientId]) {
        byClient[clientId] = { seconds: 0, hours: 0, clientName: clientMap[clientId] || 'No Client' };
      }
      byClient[clientId].seconds += log.seconds;
      byClient[clientId].hours = byClient[clientId].seconds / 3600;
      
      // By date
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
});

router.get('/time-tracking/logs', async (req, res) => {
  try {
    const db = await getDatabase();
    const { startDate, endDate, userId } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    
    const logs = await db.collection('process_time_logs')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching time logs:', error);
    res.status(500).json({ error: 'Failed to fetch time logs' });
  }
});

// Clients endpoint
router.get('/clients', async (req, res) => {
  try {
    const db = await getDatabase();
    const clients = await db.collection('process_clients')
      .find({})
      .sort({ name: 1 })
      .toArray();
    
    // Transform to match frontend format
    const result = clients.map(client => ({
      id: client._id,
      name: client.name,
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

export default router;

