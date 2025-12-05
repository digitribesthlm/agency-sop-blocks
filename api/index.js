import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from '../server/api.js';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.get('/health', async (req, res) => {
  try {
    // Test MongoDB connection
    const { getDatabase } = await import('../services/mongodb.js');
    await getDatabase();
    res.json({ status: 'ok', dbConnected: true });
  } catch (error) {
    res.status(500).json({ status: 'error', dbConnected: false, message: error.message });
  }
});

// Export as Vercel serverless function
export default app;

