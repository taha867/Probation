import express from 'express';
import route from '../src/routes/index.js';
import { initDb } from '../src/config/dbConfig.js';

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize database connection (for serverless)
let dbInitialized = false;

const ensureDbConnection = async () => {
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
    } catch (error) {
      console.error('Database connection error:', error);
      // Don't block request - will retry on next request
    }
  }
};

// Health check endpoint (register before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await ensureDbConnection();
  next();
});

// Register routes
route(app);

// Export the Express app as a serverless function
export default app;

